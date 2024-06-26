import { Route, Routes } from "react-router-dom";
import RouteContainer from "../../components/extensions/route-container";
import { useRoutes } from "../../providers/route-provider";
import GiftCardDetails from "./details";
import ManageGiftCard from "./manage";
import Overview from "./overview";
import { useAdminGetSession } from "medusa-react";

const GiftCard = () => {
  const { getNestedRoutes } = useRoutes();
  const { user } = useAdminGetSession();

  const nestedRoutes = getNestedRoutes("/gift-cards");

  return user?.role === "admin" ? (
    <Routes>
      <Route path="/" element={<Overview />} />
      <Route path="/:id" element={<GiftCardDetails />} />
      <Route path="/manage" element={<ManageGiftCard />} />
      {nestedRoutes.map((r, i) => {
        return (
          <Route
            path={r.path}
            key={i}
            element={<RouteContainer route={r} previousPath={"/gift-cards"} />}
          />
        );
      })}
    </Routes>
  ) : null;
};

export default GiftCard;
