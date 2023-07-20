import {useEffect, useState} from "react";
import apiClient, {CanceledError, AxiosError} from "./services/api-client.ts";

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
        apiClient
            .get<User[]>("/users", {signal: controller.signal})
            .then((res) => {
                setUsers(res.data)
                setIsLoading(false)
            })
            .catch((err) => {
                if (err instanceof CanceledError) return;
                setError((err as AxiosError).message)
                setIsLoading(false)
            })
        // .finally( () => setIsLoading(false));

        return () => controller.abort();

    }, [])


    const deleteUser = (user: User) => {
        const originalUsers = [...users];
        setUsers(users.filter(u => u.id !== user.id))

        apiClient
            .delete('/users/' + `${user.id}`)
            .catch(err => {
                setError((err as AxiosError).message)
                setUsers(originalUsers)
            })
    }

    const addUser = () => {
        const originalUsers = [...users];
        const newUser = {id: 0, name: "ALi"};
        setUsers([newUser, ...users]);

        apiClient
            .post('/users', newUser)
            .then( ({data: savedUser}) => setUsers([savedUser, ...users]))
            .catch(err => {
                setError((err as AxiosError).message)
                setUsers(originalUsers)
            })
    }

    const updateUser = (user: User) => {
        const originalUsers = [...users];
        const updatedUser = {...user, name: user.name + "!"}
        setUsers(users.map(u => u.id === user.id ? updatedUser : u ))

        apiClient.patch('/users/' + `${user.id}`, updatedUser)
            .catch(err => {
                setError((err as AxiosError).message)
                setUsers(originalUsers)
            })

    }

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
            <button className="btn btn-primary mb-3 px-4" onClick={addUser}>Add</button>
            <ul className="list-group">
                {users.map(user => (
                    <li key={user.id} className="list-group-item d-flex justify-content-between">{user.name}
                       <div className="d-flex gap-3">
                           <button className="btn btn-outline-secondary" onClick={() => updateUser(user)}>Update</button>
                           <button className="btn btn-outline-danger" onClick={() => deleteUser(user)}>Delete</button>
                       </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default App
