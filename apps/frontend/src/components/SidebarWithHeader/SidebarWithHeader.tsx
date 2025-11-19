import { ReactNode, ReactText } from 'react';
import {
  IconButton,
  Box,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Link,
  Drawer,
  DrawerContent,
  Text,
  useDisclosure,
  BoxProps,
  FlexProps,
} from '@chakra-ui/react';
import { FiHome, FiSettings, FiMenu, FiBell, FiEdit } from 'react-icons/fi';
import { IconType } from 'react-icons';
import AuthHeader from '../Auth/AuthHeader/AuthHeader';
import { Link as RouterLink } from 'react-router-dom';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Home', icon: FiHome, path: '/' },
  { name: 'Apply', icon: FiEdit, path: '/apply' },
  { name: 'Settings', icon: FiSettings, path: '/settings' },
];

export default function SidebarWithHeader({
  children,
}: {
  children: ReactNode;
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    // Hard-coded light background so it matches Dancing Moose and ignores dark mode
    <Box minH="100vh" bg="#f8f6f1">
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />

      <Drawer
        autoFocus={false}
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      {/* top nav on mobile */}
      <MobileNav onOpen={onOpen} />

      {/* main content */}
      <Box ml={{ base: 0, md: 60 }} p={{ base: 4, md: 8 }} bg="transparent">
        {children}
      </Box>
    </Box>
  );
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  return (
    <Box
      transition="0.3s ease"
      bg="white"
      borderRight="1px"
      borderRightColor="#e2ddd4"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="20" alignItems="center" mx="6" justifyContent="space-between">
        <Text
          fontSize="lg"
          fontFamily="'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          fontWeight="bold"
          color="#2f7f7a"
        >
          Welcome!
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>

      {LinkItems.map((link) => (
        <NavItem key={link.name} icon={link.icon} path={link.path}>
          {link.name}
        </NavItem>
      ))}
    </Box>
  );
};

interface NavItemProps extends FlexProps {
  icon: IconType;
  children: ReactText;
  path: string;
}

const NavItem = ({ icon, children, path, ...rest }: NavItemProps) => {
  return (
    <Link
      as={RouterLink}
      to={path}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="3"
        mx="4"
        borderRadius="full"
        role="group"
        cursor="pointer"
        fontSize="sm"
        color="gray.700"
        _hover={{
          bg: '#2f7f7a',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="3"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Link>
  );
};

interface MobileProps extends FlexProps {
  onOpen: () => void;
}

const MobileNav = ({ onOpen, ...rest }: MobileProps) => {
  return (
    <Flex
      ml={{ base: 0, md: 60 }}
      px={{ base: 4, md: 6 }}
      height="20"
      alignItems="center"
      bg="white"
      borderBottomWidth="1px"
      borderBottomColor="#e2ddd4"
      justifyContent={{ base: 'space-between', md: 'flex-end' }}
      {...rest}
    >
      <IconButton
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
        variant="outline"
        aria-label="open menu"
        icon={<FiMenu />}
      />

      <Text
        display={{ base: 'flex', md: 'none' }}
        fontSize="lg"
        fontFamily="'Nunito', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
        fontWeight="bold"
        color="#2f7f7a"
      >
        Welcome
      </Text>

      <HStack spacing={{ base: '0', md: '6' }}>
        <IconButton
          size="lg"
          variant="ghost"
          aria-label="notifications"
          icon={<FiBell />}
        />
        <AuthHeader />
      </HStack>
    </Flex>
  );
};
