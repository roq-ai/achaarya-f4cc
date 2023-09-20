import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
  Center,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getQuestionById, updateQuestionById } from 'apiSdk/questions';
import { questionValidationSchema } from 'validationSchema/questions';
import { QuestionInterface } from 'interfaces/question';
import { ChapterInterface } from 'interfaces/chapter';
import { getChapters } from 'apiSdk/chapters';

function QuestionEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<QuestionInterface>(
    () => (id ? `/questions/${id}` : null),
    () => getQuestionById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: QuestionInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateQuestionById(id, values);
      mutate(updated);
      resetForm();
      router.push('/questions');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<QuestionInterface>({
    initialValues: data,
    validationSchema: questionValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Questions',
              link: '/questions',
            },
            {
              label: 'Update Question',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Question
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.content}
            label={'Content'}
            props={{
              name: 'content',
              placeholder: 'Content',
              value: formik.values?.content,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Difficulty Level"
            formControlProps={{
              id: 'difficulty_level',
              isInvalid: !!formik.errors?.difficulty_level,
            }}
            name="difficulty_level"
            error={formik.errors?.difficulty_level}
            value={formik.values?.difficulty_level}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('difficulty_level', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <TextInput
            error={formik.errors.question_type}
            label={'Question Type'}
            props={{
              name: 'question_type',
              placeholder: 'Question Type',
              value: formik.values?.question_type,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.answer}
            label={'Answer'}
            props={{
              name: 'answer',
              placeholder: 'Answer',
              value: formik.values?.answer,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<ChapterInterface>
            formik={formik}
            name={'chapter_id'}
            label={'Select Chapter'}
            placeholder={'Select Chapter'}
            fetcher={getChapters}
            labelField={'title'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/questions')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'question',
    operation: AccessOperationEnum.UPDATE,
  }),
)(QuestionEditPage);
