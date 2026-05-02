import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "../../../../startFirebase";
import { Button } from "../../../../components/ui/button";

interface GetStartedButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function GetStartedButton({
  className = "bg-white text-slate-900 hover:bg-slate-100",
  children = "Get Started",
}) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleClick = () => {
    if (user) {
      navigate("/feed");
    } else {
      navigate("/login");
    }
  };

  return (
    <Button onClick={handleClick} className={className}>
      {children}
    </Button>
  );
}
