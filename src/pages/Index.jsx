import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Text, VStack, Box, Link, Input, Switch, useColorMode } from "@chakra-ui/react";

const Index = () => {
  const [stories, setStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchTopStories = async () => {
      try {
        const { data: topStoryIds } = await axios.get("https://hacker-news.firebaseio.com/v0/topstories.json");
        const top5StoryIds = topStoryIds.slice(0, 5);
        const storyPromises = top5StoryIds.map(id => axios.get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`));
        const storyResponses = await Promise.all(storyPromises);
        setStories(storyResponses.map(response => response.data));
      } catch (error) {
        console.error("Error fetching top stories:", error);
      }
    };

    fetchTopStories();
  }, []);

  const filteredStories = stories.filter(story => story.title.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Container centerContent maxW="container.md" py={8}>
      <VStack spacing={4} width="100%">
        <Box width="100%" display="flex" justifyContent="space-between" alignItems="center">
          <Text fontSize="2xl">Hacker News Top Stories</Text>
          <Switch isChecked={colorMode === "dark"} onChange={toggleColorMode} aria-label="Toggle Dark Mode" />
        </Box>
        <Input
          placeholder="Search stories..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          mb={4}
        />
        {filteredStories.map(story => (
          <Box key={story.id} p={4} borderWidth="1px" borderRadius="md" width="100%">
            <Text fontSize="lg" fontWeight="bold">
              {story.title}
            </Text>
            <Text>Upvotes: {story.score}</Text>
            <Link href={story.url} color="teal.500" isExternal>
              Read more
            </Link>
          </Box>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;