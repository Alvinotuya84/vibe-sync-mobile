import React, { useState } from "react";
import { View } from "react-native";
import ThemedModal from "./ThemedModal";
import Box from "./Box";
import ThemedText from "./ThemedText";
import ThemedButton from "./ThemedButton";
import ThemedCard from "./ThemedCard";
import ImageWrapper from "./ImageWrapper";
import ThemedIcon from "./ThemedIcon";
import { verticalScale } from "react-native-size-matters";
import useCartStore from "@/stores/useCartStore";
import ThemedTextInput, { ThemedPhoneNumberInput } from "./ThemedTextInput";
import { useTheme } from "@/hooks/useTheme.hook";
import { useToast } from "@/components/toast-manager";
import { z, ZodString } from "zod"; // Make sure this import is correct or adjust accordingly
import { router } from "expo-router";
import useForm from "@/hooks/useForm.hook";
import { useMutation } from "@tanstack/react-query";
import { postJson } from "@/utils/fetch.utils";
import { CheckoutResponse } from "@/types/checkout.types";
import { BASE_URL } from "@/constants/network";
import useUserStore from "@/stores/user.store";
import { formatToKENumber } from "@/utils/functions";
import { Pusher, PusherEvent } from "@pusher/pusher-websocket-react-native";

type Props = {};

const PaymentMethodSelection = (props: Props) => {
  const theme = useTheme();
  const { cart, selectedSupermarketBranch, clearCart } = useCartStore();
  const { showToast } = useToast();
  const { user } = useUserStore();

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "mpesa" | "card" | null
  >(null);
  const [isCheckoutModalVisible, setCheckoutModalVisible] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState("");

  const { setFormValue, getFormValue, validateForm, formState } = useForm([
    {
      name: "mobileNumber",
      value: formatToKENumber(user?.user?.phone ?? ""),
      schema: z.string().min(7),
    },
  ]);

  const totalPrice = cart.reduce(
    (sum, item) =>
      sum +
      parseFloat(`${item?.amount}`) * parseFloat(`${item?.product_quantity}`),
    0
  );

  React.useEffect(() => {
    if (transactionStatus === "started") {
      transactionListener();
    } else if (transactionStatus === "done") {
      stopTransactionListener();
    }
  }, [transactionStatus]);

  const pusher = Pusher.getInstance();

  const transactionListener = async () => {
    await pusher.init({
      apiKey: "98446ea8743a6fda87e4",
      cluster: "mt1",
    });
    await pusher.connect();
    await pusher.subscribe({
      channelName: "transaction_status",
      onEvent: (event: PusherEvent) => {
        console.log(
          `Event received: ${event.eventName} =============================================================================`
        );
        closeCheckoutModal();
        switch (event.eventName) {
          case "successful":
            showToast({ title: "Transaction Successful", type: "success" });
            setTransactionStatus("done");
            break;
          case "failed":
            showToast({ title: "Transaction Failed", type: "error" });
            setTransactionStatus("done");
            break;
          case "cancelled":
            showToast({ title: "Transaction Cancelled", type: "warning" });
            setTransactionStatus("done");
            break;
          default:
            showToast({ title: "Transaction Pending", type: "info" });
        }
      },
    });
    clearCart();
    setTransactionStatus("");
    closeCheckoutModal();
    setTimeout(() => {
      showToast({
        title: "Transaction Completed",
        type: "success",
      });
    }, 10000);
  };
  React.useEffect(() => {
    if (transactionStatus === "started") {
      transactionListener();
    } else if (transactionStatus === "done") {
      stopTransactionListener();
    }
  }, [transactionStatus]);
  const stopTransactionListener = () => {
    pusher.unsubscribe({
      channelName: "mpesa_channel",
    });
    pusher.disconnect();
  };

  const mutation = useMutation({
    mutationFn: async () => {
      let payload: any = {
        amount: totalPrice,
        businessbranch_id: selectedSupermarketBranch?.id, // Update with actual branch ID
        phone: formatToKENumber(formState.mobileNumber),
        products: cart.map((item) => ({ id: item.id })),
      };

      if (selectedPaymentMethod === "card") {
        // Handle card payment details if required
      }

      const resp = await postJson<CheckoutResponse["data"]>(
        `${BASE_URL}/transactions`,
        payload
      );
      console.log(resp);
      if (resp.success) {
        console.log(resp);
        // closeCheckoutModal();
        transactionListenerInitiator();

        showToast({ title: resp.message, type: "success" });
        // setTransactionStatus("done");
        // setTimeout(() => {
        //   router.back();
        // }, 200);
        return resp.data;
      } else {
        console.log(resp);
        throw new Error("Payment failed");
      }
    },
  });

  const handlePaymentMethodSelect = (method: "mpesa" | "card") => {
    setSelectedPaymentMethod(method);
  };

  const handleCheckout = () => {
    if (selectedPaymentMethod === "mpesa" && !formState.mobileNumber?.length) {
      console.log(formState.mobileNumber);
      // Show error message if M-Pesa is selected but mobile number is not entered
      showToast({
        title: "Please enter your M-Pesa mobile number",
        type: "warning",
      });
      return;
    }

    mutation.mutate();
    // closeCheckoutModal();
  };

  const openCheckoutModal = () => {
    setCheckoutModalVisible(true);
    setTransactionStatus("");
  };

  const closeCheckoutModal = () => {
    setCheckoutModalVisible(false);
    setSelectedPaymentMethod(null);
    setFormValue("mobileNumber", ""); // Clear mobile number input
  };
  const transactionListenerInitiator = () => {
    setTransactionStatus("started");
  };
  return (
    <Box>
      <ThemedModal
        disableKeyboardAvoidance
        visible={isCheckoutModalVisible}
        close={closeCheckoutModal}
        title="Checkout Confirmation"
        position="bottom"
        icon={{ name: "credit-card", size: "lg", color: theme.primary }}
      >
        <Box pa={20} gap={20}>
          <ThemedText size="lg" weight="bold" color={theme.primary}>
            Select Payment Method
          </ThemedText>

          <Box gap={20}>
            <ThemedButton
              type={"text"}
              onPress={() => handlePaymentMethodSelect("mpesa")}
              height={80}
              width="100%"
            >
              <ThemedCard
                borderWidth={selectedPaymentMethod === "mpesa" ? 1 : 0}
                borderColor={theme.primary}
                direction="row"
                align="center"
                justify="space-between"
                width="100%"
                pa={10}
              >
                <Box direction="row" align="center" gap={10}>
                  <ImageWrapper
                    source={require("@/assets/images/utils/cart/m-pesa-logo.jpg")}
                    height={40}
                    width={40}
                    resizeMode="contain"
                  />
                  <ThemedText size="md" weight="semibold">
                    M-Pesa
                  </ThemedText>
                </Box>
                {selectedPaymentMethod === "mpesa" && (
                  <ThemedIcon
                    name="check-circle"
                    size="md"
                    color={theme.primary}
                  />
                )}
              </ThemedCard>
            </ThemedButton>

            <ThemedButton
              type={"text"}
              onPress={() => handlePaymentMethodSelect("card")}
              height={80}
              width="100%"
              disabled
            >
              <ThemedCard
                borderWidth={selectedPaymentMethod === "card" ? 1 : 0}
                borderColor={theme.primary}
                direction="row"
                align="center"
                justify="space-between"
                width="100%"
                pa={10}
              >
                <Box
                  direction="row"
                  align="center"
                  justify="space-between"
                  px={10}
                  gap={10}
                >
                  <ImageWrapper
                    source={require("@/assets/images/utils/cart/card-icon.png")}
                    height={40}
                    width={40}
                    resizeMode="contain"
                  />
                  <ThemedText size="md" weight="semibold">
                    Card (Coming Soon)
                  </ThemedText>
                </Box>
                {selectedPaymentMethod === "card" && (
                  <ThemedIcon
                    name="check-circle"
                    size="md"
                    color={theme.primary}
                  />
                )}
              </ThemedCard>
            </ThemedButton>
          </Box>

          {selectedPaymentMethod === "mpesa" && (
            <Box mt={20}>
              <ThemedText size="md" weight="semibold">
                Enter Mobile Number
              </ThemedText>
              <ThemedTextInput
                value={formState.mobileNumber}
                placeholder="07XXXXXXXX"
                onChangeText={(text) => {
                  console.log(text);
                  setFormValue("mobileNumber", text);
                }}
              />
            </Box>
          )}

          <Box direction="row" justify="space-between" mt={20}>
            <ThemedText size="md" weight="semibold">
              Total Amount:
            </ThemedText>
            <ThemedText size="md" weight="bold" color={theme.primary}>
              Ksh {totalPrice.toFixed(2)}
            </ThemedText>
          </Box>

          <ThemedButton
            label="Confirm Payment"
            type="primary"
            size="md"
            onPress={() => {
              handleCheckout();
            }}
            loading={
              transactionStatus === "pending" ||
              transactionStatus === "started" ||
              mutation.isPending
            }
            disabled={!selectedPaymentMethod}
            icon={{ name: "check-circle", position: "append" }}
          />
        </Box>
      </ThemedModal>

      {cart.length > 0 && (
        <Box mt={20} top={-verticalScale(40)}>
          <Box mb={10}>
            <ThemedText size="lg" weight="semibold">
              Total:
            </ThemedText>
            <ThemedText size="lg" weight="bold">
              Ksh {totalPrice.toFixed(2)}
            </ThemedText>
          </Box>

          <Box direction="row" gap={10} justify="space-between">
            <ThemedButton
              label="Continue Shopping"
              type="secondary-outlined"
              size="xs"
              width={"50%"}
              onPress={() => {
                router.push("/scan");
              }}
            />
            <ThemedButton
              label="Proceed to Checkout"
              type="primary"
              width={"50%"}
              size="xs"
              onPress={openCheckoutModal}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PaymentMethodSelection;
