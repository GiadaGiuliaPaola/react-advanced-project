import React, { useState, useEffect } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  VStack,
  useToast,
  Select,
} from "@chakra-ui/react";


export const action = async ({ data }) => {
  data.categoryIds = JSON.parse(data.categoryIds);
  const newId = await fetch("http://localhost:3000/events", {
    method: "POST",
    body: JSON.stringify(data),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((json) => json.id);
  return `/events/${newId}`;
};

export const EventList = ({ events, onDelete }) => {
  return (
    <div>
      <Heading>Events List</Heading>
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.title}</strong> - {event.description}
            <br />
            <Button onClick={() => onDelete(event.id)}>Delete Event</Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const NewEvent = () => {
  const toast = useToast();
  const [events, setEvents] = useState([]);
  const loaderData
   = useLoaderData();
  const [selectedCategories, setSelectedCategories] = useState([]);
 
  useEffect(() => {
    setEvents(loaderData.events);
  }, [loaderData]);


  const categoriesData = [
    {
      name: 'sports',
      id: 1,
    },
    {
      name: 'games',
      id: 2,
    },
    {
      name: 'relaxation',
      id: 3,
    },
  ];

  const handleCategoryChange = (event) => {
    const categoryId = parseInt(event.target.value);
    setSelectedCategories((selectedCategories) => {
      if (selectedCategories.includes(categoryId)) {
        return selectedCategories.filter((id) => id !== categoryId);
      } else {
        return [...selectedCategories, categoryId];
      }
    });
  };

  const onDelete = async (eventId) => {
    await fetch(`http://localhost:3000/events/${eventId}`, {
      method: "DELETE",
    });
    const updatedEvents = events.filter((event) => event.id !== eventId);
    setEvents(updatedEvents);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = {};
    formData.forEach((value, key) => {
      data[key] = value;
    });
    const image = formData.get("image");
    const startTime = formData.get("startTime");
    const endTime = formData.get("endTime");
    const categoryIds = JSON.stringify(selectedCategories);
    const createBy = formData.get("createBy")
    data.image = image;
    data.startTime = startTime;
    data.endTime = endTime;
    data.categoryIds = categoryIds;
    data.createBy = createBy;
    
    const newPath = await action({ data });
    useNavigate(newPath);

    toast({
      title: "Event Added",
      description: "Your event has been successfully added.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack bg="yellow" borderRadius="6" p="6" className="new-event">
      <Heading>Create a New Event</Heading>
      <Form method="post" id="new-event-form" onSubmit={onSubmit}>
        <FormControl>
          <FormLabel>Image:</FormLabel>
          <Input type="file" name="image" accept="image/*" bg="yellow.50"></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Start Date:</FormLabel>
          <Input name="startTime" bg="yellow.50" type="datetime-local"></Input>
        </FormControl>
        <FormControl>
          <FormLabel>Title:</FormLabel>
          <Input
            placeholder="Write here the title"
            aria-label="Title"
            type="text"
            name="title"
            bg="yellow.50"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Description:</FormLabel>
          <Textarea
            name="description"
            aria-label="description"
            rows="6"
            placeholder="Write here a description"
            bg="yellow.50"
          />
        </FormControl>
        <FormControl>
          <FormLabel>End Date:</FormLabel>
          <Input name="endTime" bg="yellow.50" type="datetime-local"></Input>
        </FormControl>

        <FormControl>
      <FormLabel>Categories:</FormLabel>
      <Select bg="yellow.50" onChange={handleCategoryChange}>
        <option value="">Select a category</option>
        {categoriesData.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
    </FormControl>

    <FormControl>
          <FormLabel>Create By:</FormLabel>
          <Input
            name="createBy"
            aria-label="createBy"
            placeholder="Write your name here"
            bg="yellow.50"
          />
        </FormControl>
        <Button bg="orange" mt="3" type="submit">
          Add Event
        </Button>
      </Form>
      <EventList events={events} onDelete={onDelete} />
    </VStack>
  );
};
