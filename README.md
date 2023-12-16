# Mangrove Vista

## Introduction

Welcome to Mangrove Vista, Discover the epitome of luxury nestled within the heart of Sundarbans, Bangladesh, with our Suites and Villas Booking website. Immerse yourself in the enchanting beauty of the mangrove forest as you seamlessly browse, book, and experience the unique charm of Sundarbans Retreat. Escape to a world where modern comfort meets natural splendor, and let your journey into the Sundarbans begin.

## Features

Explore the Functionality of Mangrove Vista:

- **Discover Accommodations**: Users can effortlessly explore a variety of accommodations, including suites, villas, and rooms, to find the perfect retreat.

- **Book Your Stay**: Users have a seamless booking experience, allowing them to secure their preferred accommodation with just a few clicks.

- **Manage Your Bookings**: Users enjoy control over their plans, with the ability to manage and even cancel their booked accommodations for added flexibility.

- **User Profile Management**: Empower users to update or delete their profiles, ensuring a personalized and user-friendly experience.

- **Admin-Controlled User Management**: Admins have the authority to manage users, including actions such as banning, blacklisting, or unbanning users based on platform policies.

- **Booking Oversight for Admins**: Admins can efficiently manage bookings, ensuring a smooth reservation process and exceptional user experience.

- **Accommodation Management**: Admins with appropriate privileges can create, edit, or delete accommodations, maintaining a dynamic and responsive platform.

- **User Role Management**: Admins can assign and modify user roles, facilitating smooth transitions between user and admin status.

- **Blacklist Prevention for Bookings**: Admins can blacklist users, preventing them from creating bookings, ensuring a secure and trustworthy booking environment.

## Technologies

Cutting-Edge Technologies Empowering Mangrove Vista:

- Express.js
- Node.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT) for authentication

## Models

Explore the Core Models of Mangrove Vista:

### User

| Field         | Type               |
| ------------- | ------------------ |
| Name          | String             |
| Email         | String             |
| Password      | String             |
| Number        | String             |
| IsBlacklisted | Boolean            |
| Role          | Enum [user, admin] |
| Bookings      | Booking[]          |

### Accommodation

| Field           | Type             |
| --------------- | ---------------- |
| Title           | String           |
| Type            | String           |
| Capacity        | Number           |
| PricePerNight   | Number           |
| Amenities       | String[]         |
| SpecialFeatures | String[]         |
| Images          | String[]         |
| Availability    | Object{          |
|                 | startDate: Date, |
|                 | endDate: Date }  |
| Bookings        | Booking[]        |

### Booking

| Field         | Type                     |
| ------------- | ------------------------ |
| User          | {}                       |
| Accommodation | {}                       |
| PersonData    | Number                   |
| ChildData     | Number                   |
| CheckInDate   | Date                     |
| CheckOutDate  | Date                     |
| TotalPrice    | Number                   |
| Status        | enum: [pending, approved |
|               | rejected, canceled]      |

## API Routes

Explore the API Routes for Mangrove Vista:

| SL No. | HTTP Verb | Endpoint                               | Description             | Permission |
| ------ | --------- | -------------------------------------- | ----------------------- | ---------- |
| 1      | POST      | /api/auth/register                     | Register an user        | Public     |
| 2      | POST      | /api/auth/login                        | Login an user           | Public     |
| 3      | GET       | /api/users                             | Get all users           | Admin      |
| 4      | GET       | /api/users/{userId}                    | Get an user             | User/Admin |
| 5      | DELETE    | /api/users/{userId}                    | Delete an user          | User/Admin |
| 6      | PUT       | /api/users/{userId}                    | Update an user          | User       |
| 7      | PUT       | /api/users/blacklist/:userId           | Suspend an user         | Admin      |
| 8      | PUT       | /api/users/role/:userId                | Upate an user role      | Admin      |
| 9      | GET       | /api/accommodations                    | Get all accommodations  | Public     |
| 10     | GET       | /api/accommodations/{accommodationId}  | Get an accommodation    | Public     |
| 11     | POST      | /api/accommodations                    | Create an accommodation | Admin      |
| 12     | PUT       | /api/accommodations/{accommodationId}  | Update an accommodation | Admin      |
| 13     | DELETE    | /api/accommodations/{accommodationId}  | Delete an accommodation | Admin      |
| 14     | POST      | /api/bookings/create/{accommodationId} | Create a booking        | User       |
| 15     | GET       | /api/bookings                          | Get all bookings        | Admin      |
| 16     | GET       | /api/bookings/user                     | Get all user bookings   | User       |
| 17     | PUT       | /api/bookings/{bookingId}              | Cancel a booking        | User       |
| 18     | PUT       | /api/bookings/approve/{bookingId}      | Approve a booking       | Admin      |
| 19     | PUT       | /api/bookings/reject/{bookingId}       | Reject a booking        | Admin      |

## Requirements

> - **Node.js**
> - **NPM**
> - **MongoDB**

## Installation

To install and configure Mangrove Vista, Follow the steps below:

1. Clone the `repository` using:

```
git clone https://github.com/masudranashawon/mangrove-vista-server.git
```

2. Navigate to the `project` directory using:

```
cd mangrove-vista-server
```

3. Install the required `dependencies` by running:

```
npm i or npm install
```

4. Create a `.env` file in the root directory and add the following variables:

- `MONGO_URI`=Your MongoDB connection URI
- `JWT_SECRET`=A secret key for JWT token generation

5. Start the `development` server by running:

```
npm run dev
```

These steps will help you set up Mangrove Vista locally and configure the required environment variables for seamless functionality. Happy learning!

## Links

[Mangrove Vista API Endpoint](https://mangrove-vista-server.vercel.app)

## Conclusion

Discover your sanctuary of tranquility and natural wonders at Mangrove Vista. From invigorating recreational activities to a seamless blend of luxury and nature, we offer a retreat that promises an unforgettable escape. Reserve your spot in paradise today and immerse yourself in the art of relaxation. We look forward to welcoming you to the Mangrove Vista family.

## Contributing

Contributions to Mangrove Vista are welcome! If you find any bugs or have suggestions for improvements, please open an issue or submit a pull request.
