import React from "react";
import {
  Box,
  Image,
  Badge,
  Flex,
  Spacer,
  Button,
  Select,
  Modal,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { useLoaderData, Link } from "react-router-dom/dist";
import { useState } from "react";
import { NewEvent } from "./NewEvent";

export const loader = async () => {
  const eventsResponse = await fetch("http://localhost:3000/events");
  const categoriesResponse = await fetch("http://localhost:3000/categories");
  const events = await eventsResponse.json();
  const categories = await categoriesResponse.json();

  return { events, categories };
};

export const EventsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { events, categories } = useLoaderData();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredEvents = selectedCategory
    ? events.filter((event) => event.categoryIds.includes(Number(selectedCategory)))
    : events;
 
const handleCategoryChange = (e) => {
  setSelectedCategory(e.target.value);
};


  if (!events || !categories) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Box bg="black" p="5" h="400vh">
        <Select
          color="grey"
          p="3"
          value={selectedCategory || ""}
          onChange={handleCategoryChange}
        >
         <option value="">All Categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </Select>
        <Flex
          flexWrap={{ base: "wrap", md: "wrap" }}
          minHeight="max-content"
          maxwidth="90%"
          justifyContent="center"
        >
          {filteredEvents.map((event) => (
            <Box
              minWidth="20rem"
              key={event.id}
              className="event"
              borderWidth="1px"
              borderRadius="lg"
              overflow="hidden"
              m="2"
              flex="1"
              transition="transform 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            >
              <Link to={`event/${event.id}`}>
                <Image src={event.image} alt="event image" minHeight="40%" />

                <Box
                  p="6"
                  minHeight="max-content"
                  display="flex"
                  flexDirection="column"
                  justifyContent="space-between"
                >
                  <Badge borderRadius="full" px="2" colorScheme="teal">
                    {event.categoryIds && event.categoryIds.map((categoryId) => {
                      const category = categories.find(
                        (category) => category.id === categoryId
                      );
                      return (
                        <span key={categoryId}>
                          {category?.name || "Unknown Category"}
                        </span>
                      );
                    })}
                  </Badge>

                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                    ml="2"
                  >
                    {new Date(event.startTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Box>

                  <Box
                    color="white"
                    mt="1"
                    fontWeight="bold"
                    as="h4"
                    lineHeight="tight"
                    noOfLines={{ base: 2, md: 1 }}
                  >
                    {event.title}
                  </Box>

                  <Box color="white" flex="1" mt="2">
                    {event.description}
                  </Box>
                  <Box
                    color="gray.500"
                    fontWeight="semibold"
                    letterSpacing="wide"
                    fontSize="xs"
                    textTransform="uppercase"
                    ml="2"
                    mt="2"
                  >
                    Event End:{" "}
                    {new Date(event.endTime).toLocaleString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Box>
                </Box>
              </Link>
            </Box>
          ))}
        </Flex>
        <Spacer />
        <Button
          float="right"
          mr="6"
          mt="6"
          onClick={() => setIsModalOpen(true)}
        >
          Add Event
        </Button>
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <ModalContent>
            <ModalCloseButton bg="red" color="white" mr="3" />
            <ModalBody>
              <NewEvent />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
};
