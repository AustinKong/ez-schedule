import {
  Box,
  Heading,
  Field,
  Input,
  Textarea,
  VStack,
  Button,
  HStack,
  Alert,
  CloseButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { FiEdit } from "react-icons/fi";
import { useGroups } from "../../hooks/useGroups";

const GroupForm = ({ isEdit }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [alertIsOpen, setAlertIsOpen] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [group, setGroup] = useState(null);

  const { id } = useParams();
  const navigate = useNavigate();
  const { getGroup, addGroup, editGroup } = useGroups();

  useEffect(() => {
    if (!isEdit) return;

    const load = async () => {
      const data = await getGroup(id);
      if (data) {
        setGroup(data);
        setName(data.name || "");
        setDescription(data.description || "");
      }
    };

    load();
  }, [isEdit, id]);

  const handleSubmit = async () => {
    if (!name || !description) return;

    setIsSubmitting(true);
    try {
      const payload = { name, description };
      let result;
      if (isEdit) {
        result = await editGroup(id, payload);
      } else {
        result = await addGroup(payload);
      }

      if (result) navigate("/manager/groups");
    } catch (err) {
      console.error("Submit failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Heading size="3xl">
        {isEdit ? "Edit Consultation Group" : "Create Consultation Group"}
      </Heading>

      <VStack spacing={4} mt={4}>
        <Field.Root required>
          <Field.Label>
            Group Name <Field.RequiredIndicator />
          </Field.Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Final Year Capstone Team"
            autoFocus
          />
        </Field.Root>

        <Field.Root required>
          <Field.Label>
            Description <Field.RequiredIndicator />
          </Field.Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the group's purpose"
            rows={5}
          />
        </Field.Root>
      </VStack>

      {alertIsOpen && (
        <Alert.Root mt={4}>
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Title>Friendly Reminder</Alert.Title>
            <Alert.Description>
              Make sure your group name is specific and your description is
              clear. This will help students know which group to join.
            </Alert.Description>
          </Alert.Content>
          <CloseButton
            pos="relative"
            top="-2"
            insetEnd="-2"
            onClick={() => setAlertIsOpen(false)}
          />
        </Alert.Root>
      )}

      <HStack mt={6} justifyContent="space-between">
        <Button as={Link} to="/manager/groups" variant="ghost">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          isLoading={isSubmitting}
          isDisabled={!name || !description}
          colorScheme="blue"
        >
          {isEdit ? "Save Changes" : "Create Group"}{" "}
          <FiEdit style={{ marginLeft: 6 }} />
        </Button>
      </HStack>
    </Box>
  );
};

export default GroupForm;
