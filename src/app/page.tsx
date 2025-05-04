import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export default async function Home() {
  const session = await auth();
  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <header className="flex h-16 w-full items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 text-white shadow-lg">
        <h1 className="text-3xl font-extrabold">RentApp</h1>
        <div className="flex items-center gap-4">
          <SignedOut>
            <SignInButton>
              <button className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-indigo-600 transition font-medium">
                Zaloguj
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="px-4 py-2 border border-white text-white rounded hover:bg-white hover:text-indigo-600 transition font-medium">
                Zarejestruj
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton appearance={{ elements: { userButtonAvatarBox: "ring-2 ring-white" } }} />
          </SignedIn>
        </div>
      </header>

      <main className="flex flex-col items-center bg-gradient-to-b from-gray-100 to-gray-200 text-gray-800 py-12 space-y-12">
        {/* Sekcja polecanych ofert */}
        <section className="w-full max-w-6xl px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8">Polecane oferty</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, title: "Przytulna kawalerka w centrum", price: 800, img: "/apartment1.jpg" },
              { id: 2, title: "Przestronne 2 pokoje na przedmieściach", price: 1200, img: "/apartment2.jpg" },
              { id: 3, title: "Luksusowy penthouse", price: 2500, img: "/apartment3.jpg" },
            ].map((rental) => (
              <Link
                key={rental.id}
                href={`/listings/${rental.id}`}
                className="block rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition bg-white"
              >
                <img
                  src={rental.img}
                  alt={rental.title}
                  className="w-full h-56 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold mb-2 text-indigo-600">{rental.title}</h3>
                  <p className="text-lg font-medium">{rental.price} zł / miesiąc</p>
                  <button className="mt-4 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
                    Zobacz szczegóły
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sekcja wyszukiwania */}
        <section className="w-full max-w-6xl px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-8">Znajdź mieszkanie</h2>
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-md">
            <input
              type="text"
              name="minPrice"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Cena min (zł)"
              className="rounded-md p-3 border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="text"
              name="maxPrice"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Cena max (zł)"
              className="rounded-md p-3 border border-gray-300 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-400"
            />
            <select
              name="rooms"
              className="rounded-md p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="">Dowolna liczba pokoi</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
            <div className="sm:col-span-2 lg:col-span-3 flex justify-center">
              <button
                type="submit"
                className="w-full lg:w-auto px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition font-semibold"
              >
                Szukaj
              </button>
            </div>
          </form>
        </section>

        {/* Sekcja użytkownika */}
        <section className="w-full max-w-6xl px-8 text-center">
          <p className="text-xl mb-4 text-gray-700">
            {session && <span>Zalogowany jako <strong>{session.user?.name}</strong></span>}
          </p>
          <Link
            href={session ? "/api/auth/signout" : "/api/auth/signin"}
            className="inline-block px-6 py-3 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition font-semibold"
          >
            {session ? "Wyloguj" : "Zaloguj"}
          </Link>
        </section>
      </main>
    </HydrateClient>
  );
}
