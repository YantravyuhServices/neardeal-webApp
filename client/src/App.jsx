import Booking from "./Pages/Booking";
import Campaign from "./Pages/Campaign";
import CreatePackage from "./Components/CreatePackage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Transaction from "./Pages/Transaction";
import ProtectedRoutes from "./ProtechedRoutes";
import CreateCoupon from "./Components/CreateCoupon";
import Package from "./Pages/CreatePackage";
import Analytics from "./Pages/Analytics";
import SignUp from "./Pages/Signup";
import CampaignRedeemRecord from "./Components/CampaignRedeemRecord.jsx";
import Login from "./Pages/Login";
import Cookies from "js-cookie";
import CampainAnalytics from "./Components/CampainAnalytics";
import StoreSettings from "./Pages/StoreSettings.jsx";
import CampaignAdsEdit from "./Components/CampaignAdsEdit.jsx";
import CreateDiscounts from "./Components/CreateDiscounts.jsx";
import CreateNearreel from "./Components/CreateNearReel.jsx";
import EditPackage from "./Components/EditPackage.jsx";
import EditCoupon from "./Components/EditCoupon.jsx";
import NearAI from "./Pages/NearAI.jsx";
import EditDiscount from "./Components/EditDiscount.jsx";
import CreateAd from "./Components/CreateAd.jsx";

function App() {
  const jwtUserToken = Cookies.get("user_token");
  const isUserLoggedIn = jwtUserToken ? true : false;
  return (
    <Router>
      <Routes>
        {/* Signup */}
        <Route path="/signup" exact element={<SignUp></SignUp>}></Route>
        <Route path="/login" exact element={<Login />} />

        {/* <Route path='/' element={<Booking></Booking>}></Route> */}
        {/* <Route path='/analytics' element={<Analytics></Analytics>}></Route>
        <Route path='/spa/create-package' element={<CreateSpaPackage></CreateSpaPackage>}></Route>
        <Route path='/massage/create-package' element={<CreateMassagePackage></CreateMassagePackage>}></Route>
        <Route path='/sauna/create-package' element={<CreateSaunaPackage></CreateSaunaPackage>}></Route>
        <Route path='/package' element={<Package></Package>}></Route>
        <Route path='/transaction' element={<Transaction></Transaction>}></Route>
        <Route path='/campaign' element={<Campaign></Campaign>}></Route>
        <Route path='/create-coupon' element={<CreateCoupon/>}></Route>
        <Route path='/campaign/analytics' element={<CampainAnalytics/>}></Route>
        <Route path='/campaign/redeemcode' element={<CampaignRedeemRecord></CampaignRedeemRecord>}></Route>
        <Route path='/store-settings' element={<StoreSettings></StoreSettings>}></Route> */}
        <Route
          path="/nearai"
          exact
          element={
            <ProtectedRoutes
              Component={NearAI}
              isUserLoggedIn={isUserLoggedIn}
            ></ProtectedRoutes>
          }
        ></Route>
        <Route
          path="/package/:id"
          exact
          element={
            <ProtectedRoutes
              Component={EditPackage}
              isUserLoggedIn={isUserLoggedIn}
            ></ProtectedRoutes>
          }
        />
        <Route
          path="/coupon/:id"
          exact
          element={
            <ProtectedRoutes
              Component={EditCoupon}
              isUserLoggedIn={isUserLoggedIn}
            ></ProtectedRoutes>
          }
        />
        <Route
          path="/discount/:id"
          exact
          element={
            <ProtectedRoutes
              Component={EditDiscount}
              isUserLoggedIn={isUserLoggedIn}
            ></ProtectedRoutes>
          }
        />
        <Route
          path="/campaign/ads/:id"
          exact
          element={
            <ProtectedRoutes
              Component={CampaignAdsEdit}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign/create-nearreel"
          exact
          element={
            <ProtectedRoutes
              Component={CreateNearreel}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign/create-discounts"
          exact
          element={
            <ProtectedRoutes
              Component={CreateDiscounts}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign/ads"
          exact
          element={
            <ProtectedRoutes
              Component={CreateAd}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/"
          exact
          element={
            <ProtectedRoutes
              Component={Booking}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/analytics"
          exact
          element={
            <ProtectedRoutes
              Component={Analytics}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/create-package"
          exact
          element={
            <ProtectedRoutes
              Component={CreatePackage}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/package"
          exact
          element={
            <ProtectedRoutes
              Component={Package}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/transaction"
          exact
          element={
            <ProtectedRoutes
              Component={Transaction}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign"
          exact
          element={
            <ProtectedRoutes
              Component={Campaign}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign/create-coupon"
          exact
          element={
            <ProtectedRoutes
              Component={CreateCoupon}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign/analytics"
          exact
          element={
            <ProtectedRoutes
              Component={CampainAnalytics}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/campaign/redeemcode"
          exact
          element={
            <ProtectedRoutes
              Component={CampaignRedeemRecord}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
        <Route
          path="/store-settings"
          exact
          element={
            <ProtectedRoutes
              Component={StoreSettings}
              isUserLoggedIn={isUserLoggedIn}
            />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
