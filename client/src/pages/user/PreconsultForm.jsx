import {
  Box,
  Heading,
  Textarea,
  Input,
  VStack,
  Button,
  HStack,
  Text,
  Checkbox,
  Field,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getSlotDetails, submitPreConsultation } from "@/services/api";
import { formatSlotTime } from "@/utils/dateUtils";

const PreconsultFormPage = () => {
  const navigate = useNavigate();
  const { slotId } = useParams();

  const [concerns, setConcerns] = useState("");
  const [objectives, setObjectives] = useState("");
  const [documents, setDocuments] = useState(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [slot, setSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const loadSlotData = async () => {
      try {
        const data = await getSlotDetails(slotId);
        setSlot(data);
      } catch (error) {
        console.error("Failed to load slot details:", error);
        navigate("/user/slots");
      } finally {
        setLoading(false);
      }
    };
    loadSlotData();
  }, [slotId, navigate]);

  const handleFileChange = (e) => {
    setDocuments(e.target.files[0]);
  };

  const validate = () => {
    const errs = {};
    if (!concerns.trim()) errs.concerns = "Please describe your concerns";
    if (!objectives.trim()) errs.objectives = "Please state your objectives";
    if (!agreeTerms) errs.agreeTerms = "You must accept the terms";
    return errs;
  };

  const handleSubmit = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await submitPreConsultation(slotId, {
        concerns,
        objectives,
        documents,
        agreeTerms,
      });
      navigate(`/user/slots/${slotId}/confirmation`);
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  if (loading) return <Text>Loading consultation details...</Text>;
  if (!slot) return <Text>Consultation slot not found</Text>;

  return (
    <Box maxW="2xl" mx="auto" p={6} borderRadius="md" boxShadow="md">
      <Heading size="lg" mb={4}>
        Pre-Consultation Form
      </Heading>

      <Box mb={6} p={4} borderRadius="md">
        <Text fontWeight="semibold">Selected Consultation Slot</Text>
        <Text>{slot.name}</Text>
        <Text>
          {formatSlotTime(slot.start)} - {formatSlotTime(slot.end)}
        </Text>
        <Text>Location: {slot.location}</Text>
      </Box>

      <VStack spacing={5} align="stretch">
        <Field.Root required>
          <Field.Label>
            Main Concerns <Field.RequiredIndicator />
          </Field.Label>
          <Textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="Describe your main concerns for this consultation..."
            rows={4}
          />
          {errors.concerns && (
            <Text color="red.500" fontSize="sm">
              {errors.concerns}
            </Text>
          )}
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Consultation Objectives <Field.RequiredIndicator />
          </Field.Label>
          <Textarea
            value={objectives}
            onChange={(e) => setObjectives(e.target.value)}
            placeholder="What do you hope to achieve from this consultation?"
            rows={4}
          />
          {errors.objectives && (
            <Text color="red.500" fontSize="sm">
              {errors.objectives}
            </Text>
          )}
        </Field.Root>

        <Field.Root>
          <Field.Label>Supporting Documents (Optional)</Field.Label>
          <Input type="file" onChange={handleFileChange} />
          {documents && (
            <Text fontSize="sm" color="gray.600" mt={1}>
              Attached: {documents.name}
            </Text>
          )}
        </Field.Root>

        <Field.Root required>
          <Checkbox.Root
            checked={agreeTerms}
            onCheckedChange={(e) => setAgreeTerms(!!e.checked)}
          >
            <Checkbox.HiddenInput />
            <Checkbox.Control />
            <Checkbox.Label>
              I confirm that the information provided is accurate and complete
            </Checkbox.Label>
          </Checkbox.Root>
          {errors.agreeTerms && (
            <Text color="red.500" fontSize="sm">
              {errors.agreeTerms}
            </Text>
          )}
        </Field.Root>

        <HStack justify="flex-end" pt={4}>
          <Button onClick={handleSubmit} colorScheme="blue">
            Submit Pre-Consultation Form
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PreconsultFormPage;
