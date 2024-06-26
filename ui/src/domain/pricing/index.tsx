import { Route, Routes } from "react-router-dom";
import { PriceListEdit } from "./edit";
import { PriceListNew } from "./new";
import { PriceListOverview } from "./overview";
import { useAdminGetSession } from "medusa-react";

const PriceListRoute = () => {
  const { user } = useAdminGetSession();

  return user?.role === "admin" ? (
    <Routes>
      <Route index element={<PriceListOverview />} />
      <Route path="new" element={<PriceListNew />} />
      <Route path=":id" element={<PriceListEdit />} />
    </Routes>
  ) : null;
};

export default PriceListRoute;
