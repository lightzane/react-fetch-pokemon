import { useEffect, useRef, useState } from 'react';
import { useFetch } from './hooks';

function App() {
  const { data, error, loading, refetch } = useFetch('pokemon');
  const [id, setId] = useState(-1);

  let inputPokemonRef = useRef<HTMLInputElement>(null);

  function handleInput() {
    const target = inputPokemonRef.current;

    if (!target) {
      return;
    }

    refetch(target.value.trim().toLowerCase());
  }

  function handleCry() {
    const audio = new Audio(data?.cries.latest);
    audio.volume = 0.1;
    audio.play();
  }

  useEffect(() => {
    if (data) {
      new Audio(data?.cries.latest);
      setId(data.id);
      inputPokemonRef.current!.value = data.name;
    } else {
      inputPokemonRef.current!.value = '';
    }
  }, [data]);

  return (
    <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-full'>
      <div className='mt-4 sm:mt-6 lg:mt-8'>
        {/* Input Pokemon */}
        <div className='mx-auto max-w-sm flex flex-col gap-y-2 ... opacity-0 animate-enter'>
          <label
            htmlFor='pokemon'
            className='block text-sm font-medium leading-6 text-dracula-light/80'>
            Pokemon
          </label>
          <input
            ref={inputPokemonRef}
            type='text'
            name='pokemon'
            id='pokemon'
            autoComplete='off'
            className='border-0 bg-transparent !bg-dracula-dark rounded-lg py-1.5 placeholder-dracula-light/60 outline-none focus:ring-2 focus:ring-dracula-yellow ... transition-all ease-in-out duration-300'
            placeholder='Bulbasaur'
            onKeyDown={(e) => {
              if (e.code === 'Enter') {
                handleInput();
              }
            }}
            onClick={(e) => {
              e.currentTarget.selectionStart = 0;
            }}
          />
          <button
            type='button'
            className='mt-3 rounded-lg bg-dracula-cyan/90 px-3 py-2 text-sm font-semibold text-dracula-darker shadow-sm hover:bg-dracula-cyan focus:ring-2 focus:ring-offset-2 focus:ring-dracula-cyan focus:ring-offset-dracula-darker ... transition-all ease-in-out duration-500'
            onClick={handleInput}>
            Search Pokemon
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className='mt-52 text-lg flex justify-center items-center h-full animate-pulse'>
            Loading...
          </div>
        )}

        {/* Error */}
        {!!error && !loading && inputPokemonRef?.current?.value && (
          <div className='mt-52 text-lg flex flex-col justify-center items-center h-full'>
            <span>✋ No results for</span>
            <span className='text-dracula-red'>
              {inputPokemonRef.current.value}
            </span>
          </div>
        )}

        {/* Results */}
        {data && !loading && (
          // Common
          <div className='mt-10 flex items-center justify-center flex-col ... opacity-0 animate-enter'>
            <h2 className='text-lg'>{data.name}</h2>
            <div className='flex gap-x-3'>
              <img className='h-32 w-32' src={data.sprites.front_default} />
              <img className='h-32 w-32' src={data.sprites.back_default} />
            </div>

            {/* Female */}
            {data.sprites.front_female && (
              <div className='flex gap-x-3'>
                <img className='h-32 w-32' src={data.sprites.front_female} />
              </div>
            )}

            {/* Shiny Genders */}
            <div className='flex items-center justify-center gap-x-3'>
              <div className='flex gap-x-3'>
                {data.sprites.front_shiny && (
                  <img className='h-32 w-32' src={data.sprites.front_shiny} />
                )}
                {data.sprites.front_shiny_female && (
                  <img
                    className='h-32 w-32'
                    src={data.sprites.front_shiny_female}
                  />
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className='flex items-center justify-center w-full max-w-sm'>
              <button
                type='button'
                className='mt-3 rounded-l-lg bg-dracula-pink/90 px-3 py-2 text-sm font-semibold text-dracula-light shadow-sm hover:bg-dracula-pink focus:ring-2 focus:ring-offset-2 focus:ring-dracula-cyan focus:ring-offset-dracula-darker ... transition-all ease-in-out duration-500'
                onClick={() => refetch((id - 1).toString())}>
                Prev
              </button>
              <button
                type='button'
                className='mt-3 flex-[2] bg-dracula-blue/90 px-3 py-2 text-sm font-semibold text-dracula-light hover:text-dracula-darker shadow-sm hover:bg-dracula-green focus:ring-2 focus:ring-offset-2 focus:ring-dracula-cyan focus:ring-offset-dracula-darker ... transition-all ease-in-out duration-500'
                onClick={handleCry}>
                Cry
              </button>
              <button
                type='button'
                className='mt-3 rounded-r-lg bg-dracula-pink/90 px-3 py-2 text-sm font-semibold text-dracula-light shadow-sm hover:bg-dracula-pink focus:ring-2 focus:ring-offset-2 focus:ring-dracula-cyan focus:ring-offset-dracula-darker ... transition-all ease-in-out duration-500'
                onClick={() => refetch((id + 1).toString())}>
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
