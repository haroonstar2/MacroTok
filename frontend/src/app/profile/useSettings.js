import { useState, useEffect } from "react";

const useSettings = (data) => {

    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [bio, setBio] = useState('');
    const [fitnessGoal, setFitnessGoal] = useState('lose_weight');
    const [desiredWeight, setDesiredWeight] = useState('');
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [communityUpdates, setCommunityUpdates] = useState(true);
    const [isPublic, setIsPublic] = useState(true);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [timezone, setTimezone] = useState(null);

    useEffect(() => {

        if (!data) return;

        setUsername(data.username  ||  "");
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setBio(data.bio  ||  "");
        setFitnessGoal(data.fitnessGoal || 'lose_weight');
        setDesiredWeight(data.desiredWeight || '');
        setEmailNotifications(data.emailNotifications || true);
        setPushNotifications(data.pushNotifications || true);
        setCommunityUpdates(data.communityUpdates || true);
        setIsPublic(data.isPublic || true);
        setIsDarkMode(data.darkMode || false);
        setTimezone(data.timezone || null);

    }, [data]);

    return {
        state: { username, firstName, lastName, bio, fitnessGoal, desiredWeight, 
            emailNotifications, pushNotifications, communityUpdates, isPublic, isDarkMode, timezone
        },
        setters: { setUsername, setFirstName, setLastName, setBio, setFitnessGoal, setDesiredWeight, 
            setEmailNotifications, setPushNotifications, setCommunityUpdates, setIsPublic, setIsDarkMode, setTimezone
        }
    };
    
};

export default useSettings;
