import React, { useEffect, useState } from 'react';
import axios from "./axios";
import "./Row.css";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

const base_url = "https://image.tmdb.org/t/p/original/";

function Row({ title, fetchUrl, isLargeRow }) {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState("");
    
    // Snippet of code which runs based on a specific condition/variable
    useEffect(() => {
        // if [] runs once when the row loads, and dont't run again
        async function fetchData() {
            const request = await axios.get(fetchUrl);
            setMovies(request.data.results);
            return request;
        }
        fetchData();
    }, [fetchUrl]);
    // console.log(fetchUrl);
    // console.log(movies);

    const opts = {
        height: "390",
        width: "100%",
        playerVars: {
            // https://developers.google.com/youtube/player_parameters
            autoplay: 1
        },
    };

    const handleClick = (movie) => {
        if(trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie?.name || "")
            .then((url) => {
                /*
                    This code will pull out the search id in the url...
                    for example: https://www.youtube.com/watch?v=XtMThy8QKqU&list=LL&index=6&t=4896s&pbjreload=101
                    The code will pull out evrything after the question mark.
                */

                const urlParams = new URLSearchParams(new URL(url).search);
                // We want to get the value of V:
                setTrailerUrl(urlParams.get('v'));
            })
            .catch ((error) => console.log(error));
        }
    };

    return (
        <div className="row">
            {/* title */}
            <h2>{title}</h2>

            {/* container -> posters */}
            <div className="row__posters">
                {/* row poster */}
                {movies.map(movie => (
                    <img 
                    key={movie.id}
                    onClick={() => handleClick(movie)}
                    className={`row__poster ${isLargeRow && "row__posterLarge" }`}
                    src={`${base_url}${
                        isLargeRow ? movie.poster_path : movie.backdrop_path}`} 
                    alt={movie.name} />
            ))}
            </div>    
            {trailerUrl && <YouTube videoId={trailerUrl} opts={opts} />}
        </div>
    );
}

export default Row;
