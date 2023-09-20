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
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';

import { createQuestion } from 'apiSdk/questions';
import { questionValidationSchema } from 'validationSchema/questions';
import { ChapterInterface } from 'interfaces/chapter';
import { getChapters } from 'apiSdk/chapters';
import { QuestionInterface } from 'interfaces/question';

function QuestionCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: QuestionInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createQuestion(values);
      resetForm();
      router.push('/questions');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<QuestionInterface>({
    initialValues: {
      content: '',
      difficulty_level: 0,
      question_type: '',
      answer: '',
      chapter_id: (router.query.chapter_id as string) ?? null,
    },
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
              label: 'Create Question',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Question
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
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
    operation: AccessOperationEnum.CREATE,
  }),
)(QuestionCreatePage);
