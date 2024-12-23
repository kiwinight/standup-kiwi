import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import type { User } from "types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export async function clientLoader() {
  const response = await fetch(import.meta.env.VITE_API_URL + "/users");
  const users: User[] = await response.json();
  return { users };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { users } = loaderData;
  const headers = users.length > 0 ? Object.keys(users[0]) : [];

  return (
    <>
      <Welcome />
      <section>
        <h1>Users</h1>
        <br />
        <h2>List</h2>
        <table>
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>
                  {header.charAt(0).toUpperCase() + header.slice(1)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                {headers.map((header) => (
                  <td key={header}>{user[header as keyof User]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}
