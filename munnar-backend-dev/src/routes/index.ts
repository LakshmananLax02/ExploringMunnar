import { Router } from "express";
import { healthCheckController } from "../controllers/health.contoller";
import {
  createItinerary,
  listItineraries,
  updateItineraryStatus,
} from "../controllers/itinerary.controller";
import {
  createHotel,
  getHotelById,
  getHotelsList,
  editHotel,
  deleteHotel,
  createHotelBooking,
  getHotelBookingRequests,
  updateHotelBookingStatus,
  updateHotelPromotions,
} from "../controllers/hotel.controller";
import { upload } from "../middlewares/upload.middleware";
import { validateRequest } from "../middlewares/validate-request";
import {
  CreateHotelDto,
  HotelFilterDto,
  UpdateHotelDto,
  UpdateHotelPromotionsDto,
} from "../dto/hotel.dto";
import {
  createCabBooking,
  getCabBookings,
  updateCabBookingStatus,
} from "../controllers/cab-booking.controller";
import { CabBookingDTO, GetCabBookingsDTO } from "../dto/cab-booking.dto";
import {
  createSelfDriveRequest,
  updateSelfDriveRequestStatus,
  getSelfDriveRequests,
} from "../controllers/self-drive-request.controller";
import {
  SelfDriveRequestDTO,
  GetSelfDriveRequestsDTO,
} from "../dto/self-drive-request.dto";
import {
  createBikeRental,
  getBikeRentals,
  updateBikeRentalStatus,
} from "../controllers/bike-rental.controller";
import { BikeRentalDTO, GetBikeRentalDTO } from "../dto/bike-rental.dto";
import {
  createNews,
  deleteNews,
  getRecentNews,
} from "../controllers/news.controller";
import { CreateActivityDto, GetActivitiesDto } from "../dto/activity.dto";
import {
  createActivity,
  getActivitiesList,
  deleteActivity,
  editActivity,
  getActivityById,
} from "../controllers/activity.controller";
import { UpdateStatusDTO } from "../dto/status-update.dto";
import {
  HotelBookingDTO,
  HotelRequestSearchDto,
} from "../dto/hotel-booking.dto";
import {
  createBusTiming,
  deleteBusTiming,
  getBusTimings,
  updateBusTiming,
} from "../controllers/bus-timings.controller";
import { BusTimingDTO } from "../dto/bus-timings.dto";
import {
  createAttraction,
  deleteAttraction,
  getAttractions,
} from "../controllers/attraction.controller";
import { AttractionDTO } from "../dto/attraction.dto";
import { ItineraryDTO, ItineraryListDTO } from "../dto/itinerary.dto";
import {
  createContact,
  getContactsList,
  updateContactStatus,
} from "../controllers/contact.controller";
import {
  ContactFilterDto,
  CreateContactDto,
  UpdateContactStatusDto,
} from "../dto/contact.dto";
import {
  getDashboardCounts,
  getHotelBookingsChart,
  getRecentHotelBookings,
  getTransportBookingsChart,
} from "../controllers/dashboard.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

//
import { FavoriteController } from '../controllers/favorite.controller';
import { ToggleFavoriteDTO } from '../dto/favorite.dto';
import {
  createHomeSlide,
  deleteHomeSlide,
  getHomeSlides,
} from "../controllers/home-slide.controller";
import { CreateHomeSlideDto } from "../dto/home-slide.dto";
import { ReviewController } from "../controllers/review.controller";
import { CreateReviewDto } from "../dto/review.dto";

const router = Router();
const userRouter = Router();
userRouter.use(authMiddleware);

//L
const controller = new FavoriteController();
const reviewcontroller = new ReviewController();

// Health check endpoint
router.get("/health", healthCheckController);

// Itinerary routes
userRouter.post("/itinerary", validateRequest(ItineraryDTO), createItinerary);
router.post(
  "/itineraries/list",
  validateRequest(ItineraryListDTO),
  listItineraries
);
router.put(
  "/itinerary/:id/status",
  validateRequest(UpdateStatusDTO),
  updateItineraryStatus
);

// Attraction routes
userRouter.post(
  "/attractions",
  upload.single("image"),
  validateRequest(AttractionDTO),
  createAttraction
);
router.get("/attractions", getAttractions);
router.delete("/attractions/:id", deleteAttraction);

// Hotel routes
// Multer middleware handles 'images' field for multiple uploads
router.post(
  "/hotel",
  upload.array("images", 10),
  validateRequest(CreateHotelDto),
  createHotel
);
router.post("/hotels-list", validateRequest(HotelFilterDto), getHotelsList);
router.get("/hotel/:id", getHotelById);
router.put(
  "/hotel/:id",
  upload.array("images", 10),
  validateRequest(UpdateHotelDto),
  editHotel
);
router.put(
  "/hotel/:id/promotions",
  upload.single("featuredImage"),
  validateRequest(UpdateHotelPromotionsDto),
  updateHotelPromotions
);
router.delete("/hotel/:id", deleteHotel);

// Hotel booking routes
userRouter.post(
  "/hotel-booking",
  validateRequest(HotelBookingDTO),
  createHotelBooking
);
router.post(
  "/hotel-booking-list",
  validateRequest(HotelRequestSearchDto),
  getHotelBookingRequests
);
router.put(
  "/hotel-booking/:id",
  validateRequest(UpdateStatusDTO),
  updateHotelBookingStatus
);

// Bus timing routes
router.post("/bus-timing", validateRequest(BusTimingDTO), createBusTiming);
router.get("/bus-timing", getBusTimings);
router.put("/bus-timing/:id", validateRequest(BusTimingDTO), updateBusTiming);
router.delete("/bus-timing/:id", deleteBusTiming);

// Cab booking routes
userRouter.post("/cab-booking", validateRequest(CabBookingDTO), createCabBooking);
router.post(
  "/cab-booking-list",
  validateRequest(GetCabBookingsDTO),
  getCabBookings
);
router.put(
  "/cab-booking/:id",
  validateRequest(UpdateStatusDTO),
  updateCabBookingStatus
);

// Self-drive car request routes
router.post(
  "/self-drive",
  validateRequest(SelfDriveRequestDTO),
  createSelfDriveRequest
);
router.post(
  "/self-drive-list",
  validateRequest(GetSelfDriveRequestsDTO),
  getSelfDriveRequests
);
router.put(
  "/self-drive/:id",
  validateRequest(UpdateStatusDTO),
  updateSelfDriveRequestStatus
);

// Bike rental routes
userRouter.post("/bike-rentals", validateRequest(BikeRentalDTO), createBikeRental);
router.post(
  "/bike-rentals-list",
  validateRequest(GetBikeRentalDTO),
  getBikeRentals
);
router.put(
  "/bike-rentals/:id",
  validateRequest(UpdateStatusDTO),
  updateBikeRentalStatus
);

// News routes
router.post("/news", upload.single("image"), createNews);
router.get("/news", getRecentNews);
router.delete("/news/:id", deleteNews);

// Activities routes
router.post(
  "/activity",
  upload.array("images", 10),
  validateRequest(CreateActivityDto),
  createActivity
);
router.put(
  "/activity/:id",
  upload.array("images", 10),
  validateRequest(CreateActivityDto),
  editActivity
);
router.post(
  "/activities-list",
  validateRequest(GetActivitiesDto),
  getActivitiesList
);
router.delete("/activity/:id", deleteActivity);
router.get("/activity/:id", getActivityById);

// Contact route
router.post("/contact", validateRequest(CreateContactDto), createContact);
router.post(
  "/contacts-list",
  validateRequest(ContactFilterDto),
  getContactsList
);
router.put(
  "/contact/:id",
  validateRequest(UpdateContactStatusDto),
  updateContactStatus
);

// Dashboard routes
router.get("/dashboard/counts", getDashboardCounts);
router.get("/dashboard/hotel-bookings-chart", getHotelBookingsChart);
router.get("/dashboard/transport-bookings-chart", getTransportBookingsChart);
router.get("/dashboard/recent-hotel-bookings", getRecentHotelBookings);

//
router.post(
  '/favorites/toggle', 
  authMiddleware, 
  validateRequest(ToggleFavoriteDTO), 
  controller.toggleSave
);

router.get(
  '/favorites',
  authMiddleware,
  controller.getFavorites
);

// Homepage slider routes
router.post(
  "/homepage-slides",
  upload.single("image"),
  validateRequest(CreateHomeSlideDto),
  createHomeSlide
);
router.get("/homepage-slides", getHomeSlides);
router.delete("/homepage-slides/:id", deleteHomeSlide);


// Public Routes
router.get("/reviews/hotel/:hotelId", reviewcontroller.getHotelReviews);

// Protected User Routes (Requires auth middleware context)
router.post("/reviews", authMiddleware, validateRequest(CreateReviewDto), reviewcontroller.submitReview);

// Admin Moderation Routes
// router.get("/admin/reviews", authMiddleware, reviewcontroller.adminGetAllReviews);
// router.delete("/admin/reviews/:id", authMiddleware, reviewcontroller.adminDeleteReview);
router.get("/admin/reviews", reviewcontroller.adminGetAllReviews);
router.delete("/admin/reviews/:id", reviewcontroller.adminDeleteReview);

export { router, userRouter };
