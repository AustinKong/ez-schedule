import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  startTime: Yup.date().required('Required'),
  endTime: Yup.date()
    .required('Required')
    .min(Yup.ref('startTime'), 'End time must be after start time'),
  location: Yup.string().required('Required'),
});

const TimeslotForm = ({ timeslot, onSubmit, isLoading }) => (
  <Formik
    initialValues={timeslot || {
      name: '',
      startTime: '',
      endTime: '',
      location: '',
      description: ''
    }}
    validationSchema={validationSchema}
    onSubmit={onSubmit}
  >
    {({ values }) => (
      <Form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Field name="name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time</label>
            <Field 
              type="datetime-local" 
              name="startTime" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
            <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">End Time</label>
            <Field 
              type="datetime-local" 
              name="endTime" 
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            />
            <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <Field name="location" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
          <ErrorMessage name="location" component="div" className="text-red-500 text-sm" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <Field 
            as="textarea" 
            name="description" 
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
            rows="3" 
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Save Timeslot'}
        </button>
      </Form>
    )}
  </Formik>
);

export default TimeslotForm;