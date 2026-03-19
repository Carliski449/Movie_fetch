import React, { useEffect, useState } from 'react';
import Search from './components/Search';
import { Spinner } from "flowbite-react";
import MovieCard from './components/MovieCard';
import { useDebounce } from 'react-use';
import { updateSearchCount } from './appwrite';


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movies, setMovies] = useState([]);
  const [isloading, setIsLoading] = useState(false);
 

  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);


  useDebounce(
  () => {
    fetchMovies(searchTerm);
  },
  500,
  [searchTerm]
);





  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');
   
   
    


    try {
       if (!API_KEY) {
         throw new Error('API Key is undefined. Please ensure VITE_API_KEY is set in your .env file.');
       }

       const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

       const response = await fetch(endpoint, API_OPTIONS);

       if(!response.ok) {
        throw new Error('Failed to fetch movies.');
       }
       const data = await response.json();
       
       if(data.Response === 'False'){
        setErrorMessage(data.Error || 'Failed to fetch movies.');
        setMovies([]);
       return;
       }
    
    
    setMovies(data.results || []);

    updateSearchCount();
    
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      
      setErrorMessage('Error fetching movies. Please try again later');
    }
    finally {
      setIsLoading(false);
    }
  };


  
  return (
    
  
    <main>
      <div className="pattern"/>

      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="hero-banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy without the Hassle</h1>

          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isloading ? (
            <Spinner 
                aria-label="Loading movies..." 
                size="xl"
                color="gray" // You can use: "info", "success", "warning", "danger", "gray", "purple", "pink", etc.
              />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
               {movies.map((movie) =>(
                <MovieCard key={movie.id} movie={movie} />
               ))}
            </ul>
          )}

        </section>

        

        <p>Search</p>
      </div>
      </main>
  )
}

export default App