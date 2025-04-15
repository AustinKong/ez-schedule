// src/components/user/ConsultationConfirmation.jsx
import { Link, useParams } from 'react-router-dom';

const ConsultationConfirmation = () => {
  const { slotId } = useParams();

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 text-center">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-green-600">Submission Successful!</h1>
        <p className="mb-4">Your pre-consultation form has been submitted successfully.</p>
        <div className="space-y-2">
          <Link 
            to={`/user/slots/${slotId}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            View Consultation Details
          </Link>
          <br />
          <Link 
            to="/user/slots"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
          >
            Back to My Consultations
          </Link>
          <Link 
            to="/user/submissions"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded mt-4"
            >
            View All Submissions
            </Link>
        </div>
      </div>
    </div>
  );
};

export default ConsultationConfirmation;