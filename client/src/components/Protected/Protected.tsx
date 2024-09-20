import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface IProps {
  validationCompleted: boolean;
  loggedIn: boolean;
  children: React.ReactNode;
}

const Protected: React.FC<IProps> = (IProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (IProps.validationCompleted && !IProps.loggedIn) {
      navigate("/login");
    }
  }, []);

  return <>{IProps.children}</>;
};

export default Protected;
