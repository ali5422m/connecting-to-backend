import {useEffect, useState} from "react";
import axios, {AxiosError} from "axios";

interface User {
    id: number;
    name: string;
}

function App() {
    const [users, setUsers] = useState<User[]>([]);
    const [error, setError] = useState("");


    // useEffect(() => {
    //     axios
    //         .get<User[]>("https://jsonplaceholder.typicode.com/users")
    //         .then((res) => setUsers(res.data))
    //         .catch((err) => setError((err as AxiosError).message));
    // }, [])

    //way 2
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get<User[]>("https://jsonplaceholder.typicode.com/users")
                setUsers(res.data)
            } catch (err) {
                setError((err as AxiosError).message)
            }
        }

        void fetchData()

    }, [])


    return (
        <>
            {error && <p className="text-danger">{error}</p>}
            {users.map(user => (
                <div key={user.id}>{user.name}</div>
            ))}
        </>
    )
}

export default App
