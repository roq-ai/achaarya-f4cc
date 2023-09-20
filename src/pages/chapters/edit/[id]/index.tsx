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
import { getChapterById, updateChapterById } from 'apiSdk/chapters';
import { chapterValidationSchema } from 'validationSchema/chapters';
import { ChapterInterface } from 'interfaces/chapter';
import { TextbookInterface } from 'interfaces/textbook';
import { getTextbooks } from 'apiSdk/textbooks';

function ChapterEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<ChapterInterface>(
    () => (id ? `/chapters/${id}` : null),
    () => getChapterById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ChapterInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateChapterById(id, values);
      mutate(updated);
      resetForm();
      router.push('/chapters');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<ChapterInterface>({
    initialValues: data,
    validationSchema: chapterValidationSchema,
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
              label: 'Chapters',
              link: '/chapters',
            },
            {
              label: 'Update Chapter',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Chapter
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.title}
            label={'Title'}
            props={{
              name: 'title',
              placeholder: 'Title',
              value: formik.values?.title,
              onChange: formik.handleChange,
            }}
          />

          <NumberInput
            label="Number"
            formControlProps={{
              id: 'number',
              isInvalid: !!formik.errors?.number,
            }}
            name="number"
            error={formik.errors?.number}
            value={formik.values?.number}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('number', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Page Start"
            formControlProps={{
              id: 'page_start',
              isInvalid: !!formik.errors?.page_start,
            }}
            name="page_start"
            error={formik.errors?.page_start}
            value={formik.values?.page_start}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('page_start', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Page End"
            formControlProps={{
              id: 'page_end',
              isInvalid: !!formik.errors?.page_end,
            }}
            name="page_end"
            error={formik.errors?.page_end}
            value={formik.values?.page_end}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('page_end', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<TextbookInterface>
            formik={formik}
            name={'textbook_id'}
            label={'Select Textbook'}
            placeholder={'Select Textbook'}
            fetcher={getTextbooks}
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
              onClick={() => router.push('/chapters')}
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
    entity: 'chapter',
    operation: AccessOperationEnum.UPDATE,
  }),
)(ChapterEditPage);
