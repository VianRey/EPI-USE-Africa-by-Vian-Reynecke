"use client";
import React, { useState } from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarMenuToggle,
  NavbarMenuItem,
  NavbarMenu,
  NavbarContent,
  NavbarItem,
  Link,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Image,
  Input,
  Tabs,
  Tab,
} from "@nextui-org/react";
import { FaUserPlus, FaUsers, FaUserEdit, FaUserMinus } from "react-icons/fa";
import CustomInput from "../components/inputCustom";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ["Home", "Hierarchy", "About Us", "Delete"];

  const CreateSection = () => (
    <Card className="max-w-[400px] dark:bg-gray-800 bg-white shadow-md rounded-xl">
      <CardHeader className="flex gap-3">
        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
          <FaUserPlus className="text-5xl text-blue-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-md dark:text-white text-gray-900">Create</p>
          <p className="text-small dark:text-default-400 text-default-500">
            Create a new user
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="dark:text-gray-300 text-gray-700">
        <form>
          <CustomInput label="Name" placeholder="Enter name" />
          <CustomInput label="Email" type="email" placeholder="Enter email" />
          <CustomInput label="Role" placeholder="Enter role" />
        </form>
      </CardBody>
      <CardFooter>
        <Button color="primary" className="w-full">
          Create User
        </Button>
      </CardFooter>
    </Card>
  );
  const ReadSection = () => (
    <Card className="max-w-[400px] dark:bg-gray-800 bg-white shadow-md rounded-xl">
      <CardHeader className="flex gap-3">
        <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
          <FaUsers className="text-5xl text-green-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-md dark:text-white text-gray-900">Read</p>
          <p className="text-small dark:text-default-400 text-default-500">
            View user details
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="dark:text-gray-300 text-gray-700">
        <Input
          label="User ID"
          placeholder="Enter user ID"
          className="mb-2"
          classNames={{
            input: [
              "bg-transparent",
              "text-black dark:text-white",
              "placeholder:text-default-700 dark:placeholder:text-default-300",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default-700/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default-700/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default-700/50",
              "!cursor-text",
            ],
          }}
        />
        <Button color="primary" className="w-full mb-2">
          Fetch User
        </Button>
        <div className="mt-4">
          <p>
            <strong>Name:</strong> John Doe
          </p>
          <p>
            <strong>Email:</strong> john@example.com
          </p>
          <p>
            <strong>Role:</strong> Developer
          </p>
        </div>
      </CardBody>
    </Card>
  );

  const UpdateSection = () => (
    <Card className="max-w-[400px] dark:bg-gray-800 bg-white shadow-md rounded-xl">
      <CardHeader className="flex gap-3">
        <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <FaUserEdit className="text-5xl text-yellow-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-md dark:text-white text-gray-900">Update</p>
          <p className="text-small dark:text-default-400 text-default-500">
            Modify user information
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="dark:text-gray-300 text-gray-700">
        <Input
          label="User ID"
          placeholder="Enter user ID"
          className="mb-2"
          classNames={{
            input: [
              "bg-transparent",
              "text-black dark:text-white",
              "placeholder:text-default-700 dark:placeholder:text-default-300",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default-700/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default-700/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default-700/50",
              "!cursor-text",
            ],
          }}
        />
        <Input
          label="Name"
          placeholder="Update name"
          className="mb-2"
          classNames={{
            input: [
              "bg-transparent",
              "text-black dark:text-white",
              "placeholder:text-default-700 dark:placeholder:text-default-300",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default-700/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default-700/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default-700/50",
              "!cursor-text",
            ],
          }}
        />
        <Input
          label="Email"
          type="email"
          placeholder="Update email"
          className="mb-2"
          classNames={{
            input: [
              "bg-transparent",
              "text-black dark:text-white",
              "placeholder:text-default-700 dark:placeholder:text-default-300",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default-700/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default-700/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default-700/50",
              "!cursor-text",
            ],
          }}
        />
        <Input
          label="Role"
          placeholder="Update role"
          className="mb-2"
          classNames={{
            input: [
              "bg-transparent",
              "text-black dark:text-white",
              "placeholder:text-default-700 dark:placeholder:text-default-300",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default-700/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default-700/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default-700/50",
              "!cursor-text",
            ],
          }}
        />
      </CardBody>
      <CardFooter>
        <Button color="primary" className="w-full">
          Update User
        </Button>
      </CardFooter>
    </Card>
  );

  const DeleteSection = () => (
    <Card className="max-w-[400px] dark:bg-gray-800 bg-white shadow-md rounded-xl">
      <CardHeader className="flex gap-3">
        <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
          <FaUserMinus className="text-5xl text-red-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-md dark:text-white text-gray-900">Delete</p>
          <p className="text-small dark:text-default-400 text-default-500">
            Remove a user
          </p>
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="dark:text-gray-300 text-gray-700">
        <Input
          label="User ID"
          placeholder="Enter user ID to delete"
          className="mb-2"
          classNames={{
            input: [
              "bg-transparent",
              "text-black dark:text-white",
              "placeholder:text-default-700 dark:placeholder:text-default-300",
            ],
            innerWrapper: "bg-transparent",
            inputWrapper: [
              "shadow-xl",
              "bg-default-200/50",
              "dark:bg-default-700/50",
              "backdrop-blur-xl",
              "backdrop-saturate-200",
              "hover:bg-default-200/70",
              "dark:hover:bg-default-700/70",
              "group-data-[focused=true]:bg-default-200/50",
              "dark:group-data-[focused=true]:bg-default-700/50",
              "!cursor-text",
            ],
          }}
        />
      </CardBody>
      <CardFooter>
        <Button color="danger" className="w-full">
          Delete User
        </Button>
      </CardFooter>
    </Card>
  );
  return (
    <>
      <Navbar
        className="bg-gradient-to-b dark:bg-gray-800 bg-white shadow-md"
        isMenuOpen={isMenuOpen}
        onMenuOpenChange={setIsMenuOpen}
      >
        {/* Mobile Menu Toggle */}
        <NavbarContent
          className="sm:hidden dark:text-white text-gray-600"
          justify="start"
        >
          <NavbarMenuToggle
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          />
        </NavbarContent>

        {/* Logo for mobile */}
        <NavbarContent className="sm:hidden pr-3 justify-center dark:text-white text-gray-600">
          <NavbarBrand>
            <div className="relative w-24">
              {" "}
              {/* Set fixed width and height */}
              <Image
                src="/logo.png"
                alt="Project Logo"
                layout="fill"
                className="object-contain"
              />
            </div>
          </NavbarBrand>
        </NavbarContent>

        {/* Centered Logo and Links for larger screens */}
        <NavbarContent className="hidden sm:flex flex-1 justify-between items-center dark:text-white text-gray-600">
          <NavbarBrand className="flex-shrink-0">
            <div className="relative w-32">
              {" "}
              {/* Adjust width and height for larger screens */}
              <Image
                src="/logo.png"
                alt="Project Logo"
                layout="fill"
                className="object-contain"
              />
            </div>
          </NavbarBrand>

          <div className="flex gap-4">
            <NavbarItem>
              <Link className="dark:text-white text-gray-600" href="#">
                Home
              </Link>
            </NavbarItem>
            <NavbarItem isActive>
              <Link
                className="dark:text-white text-gray-600"
                href="#"
                aria-current="page"
              >
                Hierarchy
              </Link>
            </NavbarItem>
            <NavbarItem>
              <Link className="dark:text-white text-gray-600" href="#">
                Integrations
              </Link>
            </NavbarItem>
          </div>
        </NavbarContent>

        {/* Avatar and other items aligned to the right */}
        <NavbarContent
          justify="end"
          className="gap-2 dark:text-white text-gray-600"
        >
          <NavbarItem className="lg:hidden">
            {/* Smaller Avatar for small screens */}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="xs"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </NavbarItem>
          <NavbarItem className="hidden lg:flex">
            {/* Larger Avatar for large screens */}
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              color="secondary"
              name="Jason Hughes"
              size="sm"
              src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
            />
          </NavbarItem>
        </NavbarContent>

        {/* Mobile Dropdown Menu */}
        <NavbarMenu className="dark:text-white text-gray-600 bg-transparent">
          {menuItems.map((item, index) => (
            <NavbarMenuItem key={`${item}-${index}`}>
              <Link
                className="w-full dark:text-white text-gray-600"
                color={
                  index === 2
                    ? "warning"
                    : index === menuItems.length - 1
                    ? "danger"
                    : "foreground"
                }
                href="#"
                size="lg"
              >
                {item}
              </Link>
            </NavbarMenuItem>
          ))}
        </NavbarMenu>
      </Navbar>
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 p-4">
        <Card className="w-full max-w-[800px] dark:bg-gray-800 bg-white shadow-md rounded-xl">
          <CardBody>
            <Tabs className="" aria-label="CRUD Operations">
              <Tab key="create" title="Create">
                <CreateSection />
              </Tab>
              <Tab key="read" title="Read">
                <ReadSection />
              </Tab>
              <Tab key="update" title="Update">
                <UpdateSection />
              </Tab>
              <Tab key="delete" title="Delete">
                <DeleteSection />
              </Tab>
            </Tabs>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
