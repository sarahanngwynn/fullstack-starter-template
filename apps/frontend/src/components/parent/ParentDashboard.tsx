import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    HStack,
    Icon,
    SimpleGrid,
    Stat,
    StatLabel,
    StatNumber,
    Text,
    VStack,
  } from "@chakra-ui/react";
  
  import {
    FiBookOpen,
    FiCalendar,
    FiClipboard,
    FiFileText,
    FiUsers,
  } from "react-icons/fi";
  
  import { trpc } from "../../utils/trpc";
  
  export function ParentDashboard() {
    const data = {
        applications: [],
        registrations: [],
      };
      
      const isLoading = false;
  
    if (isLoading) {
      return (
        <Box p={8}>
          <Text>Loading parent portal...</Text>
        </Box>
      );
    }
  
    const applications = data?.applications ?? [];
    const registrations = data?.registrations ?? [];
  
    const childrenMap = new Map();
  
    applications.forEach((app: any) => {
      app.children?.forEach((child: any) => {
        childrenMap.set(child.name, child);
      });
    });
  
    registrations.forEach((reg: any) => {
      reg.children?.forEach((child: any) => {
        childrenMap.set(child.name, child);
      });
    });
  
    const children = Array.from(childrenMap.values());
  
    return (
      <Box p={8}>
        <VStack align="stretch" spacing={8}>
          {/* Header */}
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <Box>
              <Heading size="lg">Parent Portal</Heading>
  
              <Text color="gray.600" mt={1}>
                Manage registrations, applications, and school information.
              </Text>
            </Box>
  
            <HStack>
              <Button colorScheme="teal">
                New Registration
              </Button>
  
              <Button variant="outline">
                New Application
              </Button>
            </HStack>
          </Flex>
  
          {/* Stats */}
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
            <StatCard
              label="Children"
              value={children.length}
              icon={FiUsers}
            />
  
            <StatCard
              label="Applications"
              value={applications.length}
              icon={FiClipboard}
            />
  
            <StatCard
              label="Registrations"
              value={registrations.length}
              icon={FiFileText}
            />
          </SimpleGrid>
  
          {/* Main Grid */}
          <Grid
            templateColumns={{ base: "1fr", lg: "2fr 1fr" }}
            gap={6}
          >
            {/* Left Side */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                {/* Children */}
                <PortalCard title="Your Children">
                  {children.length === 0 ? (
                    <Text color="gray.500">
                      No children added yet.
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={4}>
                      {children.map((child: any, index) => (
                        <Box
                          key={index}
                          borderWidth="1px"
                          borderRadius="lg"
                          p={4}
                        >
                          <Heading size="sm">
                            {child.name}
                          </Heading>
  
                          <Text color="gray.600" mt={1}>
                            Age: {child.age || "Unknown"}
                          </Text>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </PortalCard>
  
                {/* Applications */}
                <PortalCard title="Recent Applications">
                  {applications.length === 0 ? (
                    <Text color="gray.500">
                      No applications submitted yet.
                    </Text>
                  ) : (
                    <VStack align="stretch" spacing={3}>
                      {applications.map((app: any) => (
                        <Box
                          key={app.id}
                          borderWidth="1px"
                          borderRadius="lg"
                          p={4}
                        >
                          <HStack justify="space-between">
                            <Box>
                              <Text fontWeight="bold">
                                Application Submitted
                              </Text>
  
                              <Text
                                fontSize="sm"
                                color="gray.600"
                              >
                                {new Date(
                                  app.createdAt
                                ).toLocaleDateString()}
                              </Text>
                            </Box>
  
                            <Button
                              size="sm"
                              variant="outline"
                            >
                              View
                            </Button>
                          </HStack>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </PortalCard>
              </VStack>
            </GridItem>
  
            {/* Right Side */}
            <GridItem>
              <VStack spacing={6} align="stretch">
                <PortalCard title="Quick Links">
                  <VStack align="stretch">
                    <QuickLink
                      icon={FiCalendar}
                      label="School Calendar"
                    />
  
                    <QuickLink
                      icon={FiBookOpen}
                      label="Programs"
                    />
  
                    <QuickLink
                      icon={FiClipboard}
                      label="Forms"
                    />
                  </VStack>
                </PortalCard>
  
                <PortalCard title="Announcements">
                  <Text color="gray.600">
                    Welcome to the new parent portal 🎉
                  </Text>
                </PortalCard>
              </VStack>
            </GridItem>
          </Grid>
        </VStack>
      </Box>
    );
  }
  
  function PortalCard({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) {
    return (
      <Box
        bg="white"
        borderRadius="xl"
        p={6}
        borderWidth="1px"
        shadow="sm"
      >
        <VStack align="stretch" spacing={4}>
          <Heading size="md">{title}</Heading>
  
          {children}
        </VStack>
      </Box>
    );
  }
  
  function StatCard({
    label,
    value,
    icon,
  }: {
    label: string;
    value: number;
    icon: any;
  }) {
    return (
      <Box
        bg="white"
        borderWidth="1px"
        borderRadius="xl"
        p={5}
        shadow="sm"
      >
        <HStack justify="space-between">
          <Stat>
            <StatLabel>{label}</StatLabel>
  
            <StatNumber>{value}</StatNumber>
          </Stat>
  
          <Icon as={icon} boxSize={6} color="teal.500" />
        </HStack>
      </Box>
    );
  }
  
  function QuickLink({
    icon,
    label,
  }: {
    icon: any;
    label: string;
  }) {
    return (
      <Button
        justifyContent="flex-start"
        leftIcon={<Icon as={icon} />}
        variant="ghost"
      >
        {label}
      </Button>
    );
  }