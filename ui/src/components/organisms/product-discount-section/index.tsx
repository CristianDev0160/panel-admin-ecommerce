import { Product } from "@medusajs/medusa";
import { Container, Button, Input } from "@medusajs/ui";
import { useState, useEffect } from "react";
import Axios from "axios";
import { useAdminProduct, useAdminUpdateProduct } from "medusa-react";

const URL_BASE = process.env.MEDUSA_BACKEND_URL;
// const URL_BASE = "http://localhost:9000";

type Props = {
  product: Product;
};

import useNotification from "../../../hooks/use-notification";

const ProductDiscountSection = ({ product }: Props) => {
  const [discount, setDiscount] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const updateProduct = useAdminUpdateProduct(product?.id);
  const { isLoading, ...dataProduct } = useAdminProduct(product?.id);
  const notification = useNotification();
  // Cambiar valor de input
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const isValidInput = /^\d+$/.test(value); // Verificar si es un número entero

    if (isValidInput && value >= 1 && value <= 100) {
      setDiscount(parseInt(value)); // Convertir el valor a entero antes de establecerlo
      setHasChanged(true);
    }
  };

  // Actualizar descuento
  const handleUpdate = async (isDisabled = false) => {
    const valueDiscount = isDisabled ? 0 : ~~discount;
    updateProduct.mutate(
      {
        // eslint-disable-next-line
        discount: valueDiscount,
      },
      {
        onSuccess: ({ product }) => {
          notification("Producto", "Descuento actualizado!", "success");
          setHasChanged(false);
          setDiscount(valueDiscount);
        },
      }
    );
  };

  // Obtener descuento
  const _getDataProduct = async () => {
    const url = `${URL_BASE}/store/products/${product?.id}`;

    try {
      const response = await Axios({ method: "get", url });
      if (response?.status === 200) {
        setDiscount(response?.data?.product?.discount || 0);
      } else {
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  };

  // Obtener valor de descuento
  useEffect(() => {
    if (product?.id) {
      _getDataProduct();
    }
  }, [product]);

  return (
    <Container>
      <div className="w-full flex flex-col gap-2">
        <h1 className="text-grey-90 inter-xlarge-semibold">Descuento</h1>
        <p>
          Recuerda que el descuento será un porcentaje y no una cantidad fija.
          <span>(Valores aceptados de 0 a 100)</span>
        </p>
        <Input
          className="mt-1"
          type="number"
          placeholder="0%"
          value={discount}
          onChange={handleInputChange}
        />

        <div className="flex flex-row gap-2">
          <Button
            variant="primary"
            onClick={() => handleUpdate()}
            disabled={!hasChanged}
          >
            Guardar descuento
          </Button>
          <Button
            variant="secondary"
            disabled={discount === 0 || discount < 1}
            onClick={() => handleUpdate(true)}
          >
            Desactivar
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default ProductDiscountSection;
