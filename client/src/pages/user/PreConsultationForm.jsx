// src/components/user/PreConsultationForm.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { 
  getSlotDetails,
  submitPreConsultation 
} from '../../services/api';
import { formatSlotTime } from '../../utils/dateUtils';

const validationSchema = Yup.object().shape({
  concerns: Yup.string()
    .required('Please describe your concerns')
    .max(500, 'Maximum 500 characters'),
  objectives: Yup.string()
    .required('Please state your objectives')
    .max(500, 'Maximum 500 characters'),
  documents: Yup.mixed(),
  agreeTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms')
});

const PreConsultationForm = () => {
  const { slotId } = useParams();
  const navigate = useNavigate();
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSlotData = async () => {
      try {
        const data = await getSlotDetails(slotId);
        setSlot(data);
      } catch (error) {
        console.error('Failed to load slot details:', error);
        navigate('/user/slots');
      } finally {
        setLoading(false);
      }
    };
    
    loadSlotData();
  }, [slotId, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await submitPreConsultation(slotId, values);
      navigate(`/user/slots/${slotId}/confirmation`);
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading consultation details...</div>;
  if (!slot) return <div className="text-center py-8">Consultation slot not found</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Pre-Consultation Form</h1>
        
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="font-semibold mb-2">Selected Consultation Slot</h2>
          <p className="text-gray-600">{slot.name}</p>
          <p className="text-gray-600">{formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}</p>
          <p className="text-gray-600">Location: {slot.location}</p>
        </div>

        <Formik
          initialValues={{
            concerns: '',
            objectives: '',
            documents: null,
            agreeTerms: false
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Main Concerns *
                  <Field
                    as="textarea"
                    name="concerns"
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="Describe your main concerns for this consultation..."
                  />
                </label>
                <ErrorMessage name="concerns" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Consultation Objectives *
                  <Field
                    as="textarea"
                    name="objectives"
                    rows="4"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="What do you hope to achieve from this consultation?"
                  />
                </label>
                <ErrorMessage name="objectives" component="div" className="text-red-500 text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Supporting Documents (Optional)
                  <input
                    type="file"
                    onChange={(e) => setFieldValue('documents', e.currentTarget.files[0])}
                    className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </label>
                <ErrorMessage name="documents" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mt-4">
                <label className="flex items-center">
                  <Field
                    type="checkbox"
                    name="agreeTerms"
                    className="rounded border-gray-300 text-blue-600 shadow-sm"
                  />
                  <span className="ml-2 text-sm">
                    I confirm that the information provided is accurate and complete *
                  </span>
                </label>
                <ErrorMessage name="agreeTerms" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Pre-Consultation Form'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default PreConsultationForm;