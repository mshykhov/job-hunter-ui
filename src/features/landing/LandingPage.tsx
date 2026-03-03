import { Button, Flex, Typography, theme } from "antd";
import { AimOutlined, LoginOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export const LandingPage = () => {
  const { isAuthenticated, isConfigured, loginWithRedirect } = useAuth();
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Flex
      vertical
      align="center"
      justify="center"
      gap={24}
      style={{ minHeight: "100vh", padding: 24 }}
    >
      <AimOutlined style={{ fontSize: 64, color: token.colorPrimary }} />
      <Typography.Title level={2} style={{ margin: 0 }}>
        Job Hunter
      </Typography.Title>
      <Typography.Text type="secondary" style={{ fontSize: 16, textAlign: "center", maxWidth: 480 }}>
        Monitor and track job vacancies from multiple sources. Filter, review, and manage your job
        search in one place.
      </Typography.Text>
      {isAuthenticated ? (
        <Button type="primary" size="large" icon={<ArrowRightOutlined />} onClick={() => navigate("/jobs")}>
          Go to Jobs
        </Button>
      ) : isConfigured ? (
        <Button type="primary" size="large" icon={<LoginOutlined />} onClick={() => loginWithRedirect()}>
          Sign In
        </Button>
      ) : (
        <Button type="primary" size="large" icon={<ArrowRightOutlined />} onClick={() => navigate("/jobs")}>
          Get Started
        </Button>
      )}
    </Flex>
  );
};
