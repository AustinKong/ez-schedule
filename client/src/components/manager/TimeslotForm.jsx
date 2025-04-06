// src/components/manager/TimeslotForm.jsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { format, parseISO } from 'date-fns';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Consultation name is required'),
  startTime: Yup.date()
    .required('Start time is required')
    .min(new Date(), 'Start time cannot be in the past'),
  endTime: Yup.date()
    .required('End time is required')
    .min(Yup.ref('startTime'), 'End time must be after start time')
    .test(
      'duration',
      'Consultation must be at least 15 minutes',
      function (value) {
        const start = this.parent.startTime;
        return (value - start) >= 15 * 60 * 1000; // 15min minimum
      }
    ),
  location: Yup.string()
    .required('Location is required')
    .max(100, 'Location too long'),
  description: Yup.string().max(500, 'Description too long')
});

const formatDateTimeLocal = (isoString) => {
  if (!isoString) return '';
  try {
    return format(parseISO(isoString), "yyyy-MM-dd'T'HH:mm");
  } catch {
    return '';
  }
};

const TimeslotForm = ({ timeslot, onSubmit, isLoading }) => (
  <Formik
    initialValues={timeslot ? {
      ...timeslot,
      startTime: formatDateTimeLocal(timeslot.startTime),
      endTime: formatDateTimeLocal(timeslot.endTime)
    } : {
      name: '',
      startTime: '',
      endTime: '',
      location: '',
      description: ''
    }}
    validationSchema={validationSchema}
    onSubmit={(values) => {
      // Convert to ISO format with timezone offset
      const processed = {
        ...values,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString()
      };
      onSubmit(processed);
    }}
  >
    {({ values }) => (
      <Form className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consultation Name
          </label>
          <Field 
            name="name" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
        </div>

        {/* Time Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Time (SGT)
            </label>
            <Field
              type="datetime-local"
              name="startTime"
              min={format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Time (SGT)
            </label>
            <Field
              type="datetime-local"
              name="endTime"
              min={values.startTime || format(new Date(), "yyyy-MM-dd'T'HH:mm")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm" />
          </div>
        </div>

        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Consultation Location
          </label>
          <Field
            name="location"
            placeholder="E.g. COM1-0210, Zoom Meeting, etc."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Additional Details (Optional)
          </label>
          <Field
            as="textarea"
            name="description"
            rows="3"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
        </div>

        {/* Timezone Notice */}
        <p className="text-sm text-gray-500">
          All times are in Singapore Standard Time (GMT+8). Double-check your local time:
          {values.startTime && ` ${format(new Date(values.startTime), 'd MMM yyyy, h:mm a')}`}
        </p>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : timeslot?.id ? 'Update Consultation Slot' : 'Create Consultation Slot'}
        </button>
      </Form>
    )}
  </Formik>
);

export default TimeslotForm;