import React, { useState, useEffect } from "react";
import { Box, Heading, Input, ListItem, UnorderedList } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export const Navigation = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch("http://localhost:3000/events");
      const eventData = await response.json();
      setEvents(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Box bg="black" p={4} align="right">
        <Link to="/">
          <Heading color="white" size="md" mr="6">
            Back to Home
          </Heading>
        </Link>
      </Box>
      <Box bg="black">
        <Input
        color ="white"
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <UnorderedList
          color="gray.500"
          style={{ listStyleType: "none", padding: 0 }}
        >
          {filteredEvents.map((event) => (
            <ListItem key={event.id}>
              <Link to={`event/${event.id}`}> {event.title} </Link>
            </ListItem>
          ))}
        </UnorderedList>
      </Box>
    </>
  );
};
