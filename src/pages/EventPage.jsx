import React, { useReducer } from "react";
import {
  Heading,
  Text,
  Box,
  Image,
  Button,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useParams, useLoaderData } from "react-router-dom";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const creatorResponse = await fetch("http://localhost:3000/users");
  const events = await eventsResponse.json();
  const categories = await categoriesResponse.json();
  const creator = await creatorResponse.json();

  return { events, categories, creator };
};

const initialState = {
  isEditing: false,
  editedEvent: {},
  isDeleteModalOpen: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "EDIT":
      return { ...state, isEditing: true };
    case "CANCEL_EDIT":
      return { ...state, isEditing: false };
    case "UPDATE_EDITED_EVENT":
      return { ...state, editedEvent: action.payload };
    case "OPEN_DELETE_MODAL":
      return { ...state, isDeleteModalOpen: true };
    case "CLOSE_DELETE_MODAL":
      return { ...state, isDeleteModalOpen: false };
    default:
      return state;
  }
};

export const EventPage = () => {
  const { eventId } = useParams();
  const toast = useToast();
  const { events, categories, creator } = useLoaderData();
  const [state, dispatch] = useReducer(reducer, initialState);
  const { isEditing, editedEvent, isDeleteModalOpen } = state;
  const event = events.find((event) => event.id === parseInt(eventId));
  const createdByUser = creator.find((user) => user.id === event?.createdBy);
  const categoryForEvent = event && event.categoryIds
  ? categories.find((category) => event.categoryIds.includes(category.id))
  : null;

  

  const handleEdit = () => {
    dispatch({ type: "EDIT" });
    dispatch({ type: "UPDATE_EDITED_EVENT", payload: event });
  };

  const handleCancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const handleSave = async (data) => {
    try {
      console.log("Updating event with ID:", data.id);
      const response = await fetch(`http://localhost:3000/events/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("Response:", response);

      if (!response.ok) {
        throw new Error("Ops! Something went wrong");
      }

      toast({
        title: "Event Saved",
        description: "Your event has been successfully edited.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      dispatch({
        type: "UPDATE_EDITED_EVENT",
        payload: {
          ...editedEvent,
          title: data.title,
          description: data.description,
          startTime: data.startTime,
          endTime: data.endTime,
        },
      });
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async (eventId) => {
    try {
      const response = await fetch(`http://localhost:3000/events/${eventId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Ops! Something went wrong");
      }

      const updatedEvents = events.filter((event) => event.id !== eventId);

      dispatch({ type: "UPDATE_EVENTS", payload: updatedEvents });

      toast({
        title: "Event Deleted",
        description: "Your event has been successfully deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      dispatch({ type: "CLOSE_DELETE_MODAL" });
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <Box p="6" bg="black" align="center" h="400vh" >
      <Image src={event.image} alt="Event" maxW="400px" borderRadius="5px" />
      <Heading color="white">{event.title}</Heading>
      <Text color="white">{event.description}</Text>
      <Text color="white">Start Time: {new Date(event.startTime).toLocaleString()}</Text>
      <Text color="white">End Time: {new Date(event.endTime).toLocaleString()}</Text>
      {categoryForEvent && categoryForEvent.name && <Text color="white">Categories: {categoryForEvent.name}</Text>}
      {createdByUser && createdByUser.name && <Text  mt="10" mb="3" color="white">Created by: {createdByUser.name}</Text>}
      {createdByUser && createdByUser.image && <Image borderRadius="50%" maxHeight="10rem" src={createdByUser.image} alt={createdByUser.name} />}

      {isEditing ? (
        <Box color="white" mt="4">
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              value={editedEvent.title}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDITED_EVENT",
                  payload: { ...editedEvent, title: e.target.value },
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Description</FormLabel>
            <Input
              value={editedEvent.description}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDITED_EVENT",
                  payload: { ...editedEvent, description: e.target.value },
                })
              }
            />
          </FormControl>
          <FormControl>
            <FormLabel>Time</FormLabel>
            <Input
              value={editedEvent.startTime}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDITED_EVENT",
                  payload: { ...editedEvent, startTime: e.target.value },
                })
              }
            />
            <Input
              value={editedEvent.endTime}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_EDITED_EVENT",
                  payload: { ...editedEvent, endTime: e.target.value },
                })
              }
            />
          </FormControl>

          <Button
            colorScheme="blue"
            mt="2"
            onClick={() => handleSave(editedEvent)}
          >
            Save
          </Button>
          <Button colorScheme="orange" ml="3" mt="2" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </Box>
      ) : (
        <Button colorScheme="blue" mt="4" onClick={handleEdit}>
          Edit
        </Button>
      )}

      <Button
        colorScheme="red"
        ml="3"
        mt="4"
        onClick={() => dispatch({ type: "OPEN_DELETE_MODAL" })}
      >
        Delete
      </Button>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalCloseButton />
          <ModalBody>Are you sure you want to delete this event?</ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => dispatch({ type: "CLOSE_DELETE_MODAL" })}
            >
              Cancel
            </Button>
            <Button colorScheme="red" onClick={() => handleDelete(event.id)}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};
