import { useEffect } from "react";
import { App } from "antd";
import { registerErrorHandler } from "@/lib/api";

export const ApiErrorHandler = () => {
  const { notification } = App.useApp();

  useEffect(() => {
    registerErrorHandler((title, detail) => {
      notification.error({
        message: title,
        description: detail,
        placement: "topRight",
        duration: 5,
      });
    });
  }, [notification]);

  return null;
};
