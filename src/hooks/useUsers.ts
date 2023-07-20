import {useEffect, useState} from "react";
import UserService, {User} from "../services/user-service.ts";
import {AxiosError, CanceledError} from "../services/api-client.ts";


const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {

        setIsLoading(true)
        const {request, cancel} = UserService.getAll<User>();
        request.then((res) => {
            setUsers(res.data)
            setIsLoading(false)
        })
            .catch((err) => {
                if (err instanceof CanceledError) return;
                setError((err as AxiosError).message)
                setIsLoading(false)
            })
        // .finally( () => setIsLoading(false));
        return () => cancel();

    }, []);

    return {users, error, isLoading, setUsers, setError}
}

export default useUsers;