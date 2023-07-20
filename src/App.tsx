import {useEffect, useState} from "react";
import axios, {AxiosError, CanceledError} from "axios";

interface User {
    id: number;
    name: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);



    useEffect(() => {
        const controller = new AbortController()

        setIsLoading(true)
        axios
            .get<User[]>("https://jsonplaceholder.typicode.com/users", {signal: controller.signal})
            .then((res) => {
                setUsers(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                if(err instanceof CanceledError) return;
                setError((err as AxiosError).message)
                setIsLoading(false)
            })
            // .finally( () => setIsLoading(false));

        return () => controller.abort();

    }, [])

    //way 2
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users")
    //             setUsers(res.data)
    //         } catch (err) {
    //             setError((err as AxiosError).message)
    //         }
    //     }
    //
    //     void fetchData()
    //
    // }, [])


    return (
        <>
            {error && <p className="text-danger">{error}</p>}
            {isLoading && <div className="spinner-border"></div>}
            {users.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </>
    )
}

export default App
