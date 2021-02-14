import {get} from "../core/routes/decorators";
import {GlobalContext} from "../core/context/global";
import {User} from "../core/auth/types";
import {AuthBindings} from "../core/auth/bindings";
import {onlyLoggedIn} from "../core/auth/decorators";
import {ZoneContext} from "../core/context/zone";
import {DatasourceBindings} from "../datasources/bindings";
import {request} from "../core/request/decorators";
import {HttpErrors} from "../core/errors";


interface Movie {
    title: string
    episode_id: number
    opening_crawl: string
    director: string
    producer: string
    release_date: string
    species: string[]
    starships: string[]
    vehicles: string[]
    characters: string[]
    planets: string[]
    url: string
    created: string
    edited: string
}

interface Starship {
    name: string
    model: string
    starship_class: string
    manufacturer: string
    cost_in_credits: string
    length: string
    crew: string
    passengers: string
    max_atmosphering_speed: string
    hyperdrive_rating: string
    MGLT: string
    cargo_capacity: string
    consumables: string
    films: string[]
    pilots: string[]
    url: string
    created: string
    edited: string
}

interface Vehicle {
    name: string
    model: string
    vehicle_class: string
    manufacturer: string
    length: string
    cost_in_credits: string
    crew: string
    passengers: string
    max_atmosphering_speed: string
    cargo_capacity: string
    consumables: string
    films: string[]
    pilots: string[]
    url: string
    created: string
    edited: string
}

interface Species {
    name: string
    classification: string
    designation: string
    average_height: string
    average_lifespan: string
    eye_colors: string
    hair_colors: string
    skin_colors: string
    language: string
    homeworld: string
    people: string []
    films: string []
    url: string
    created: string
    edited: string
}

interface Planet {

    name: string
    diameter: string
    rotation_period: string
    orbital_period: string
    gravity: string
    population: string
    climate: string
    terrain: string
    surface_water: string
    residents: string[]
    films: string[]
    url: string
    created: string
    edited: string

}

function checkForCharacterMultiple<T extends { [x: string]: any }>(entries: T[], characterId: number, characterKey: keyof T) {
    return entries.filter(x => checkForCharacter(x, characterId, characterKey))
}

function checkForCharacter<T extends { [x: string]: any }>(entry: T, characterId: number, characterKey: keyof T) {
    return (entry[characterKey] as string[]).map(x => x.split('/')).map(x => x[x.length - 2]).map(Number).includes(characterId)
}

async function fetchOne<T extends { [x: string]: any }>(endpoint: string, id: number, key: keyof T): Promise<T | null> {
    const axios = GlobalContext.get().getValue(DatasourceBindings.Axios)
    if (!axios)
        throw new Error("Can't access axios");
    const user: User = ZoneContext.get()?.getValue(AuthBindings.User) as User;
    let entry: T;
    try {
        entry = (await axios.get(`/${endpoint}/${id}`))?.data;
    } catch {
        throw new HttpErrors.NotFound()
    }
    if (!checkForCharacter(entry, user.heroId, key))
        throw new HttpErrors.Forbidden()
    return entry;
}

async function fetchMany<T extends { [x: string]: any }>(endpoint: string, key: keyof T): Promise<T[] | undefined> {
    const axios = GlobalContext.get().getValue(DatasourceBindings.Axios)
    if (!axios)
        throw new Error("Can't access axios");
    const user: User = ZoneContext.get()?.getValue(AuthBindings.User) as User;
    let entries: T[];
    try {
        entries = (await axios.get(`/${endpoint}`))?.data.results;
    } catch {
        throw new HttpErrors.NotFound()
    }
    return checkForCharacterMultiple(entries, user.heroId, key)
}

export class MoviesController {


    @onlyLoggedIn
    @get('/movies')
    async getMovies() {
        return fetchMany<Movie>('movies', 'characters')
    }

    @onlyLoggedIn
    @get('/movies/:id')
    async getMovie(@request.params.number('id') id: number) {
        return fetchOne<Movie>('movies', id, 'characters')
    }

    @onlyLoggedIn
    @get('/species')
    async getSpecies() {
        return fetchMany<Species>('species', 'people')
    }

    @onlyLoggedIn
    @get('/species/:id')
    async getSpeciesOne(@request.params.number('id') id: number) {
        return fetchOne<Species>('species', id, 'people')
    }

    @onlyLoggedIn
    @get('/vehicles')
    async getVehicles() {
        return fetchMany<Vehicle>('vehicles', 'pilots')
    }

    @onlyLoggedIn
    @get('/vehicles/:id')
    async getVehicle(@request.params.number('id') id: number) {
        return fetchOne<Vehicle>('vehicles', id, 'pilots')
    }

    @onlyLoggedIn
    @get('/starships')
    async getStarships() {
        return fetchMany<Starship>('starships', 'pilots')
    }

    @onlyLoggedIn
    @get('/starships/:id')
    async getStarship(@request.params.number('id') id: number) {
        return fetchOne<Starship>('starships', id, 'pilots')
    }

    @onlyLoggedIn
    @get('/planets')
    async getPlanets() {
        return fetchMany<Planet>('planets', 'residents')
    }

    @onlyLoggedIn
    @get('/planets/:id')
    async getPlanet(@request.params.number('id') id: number) {
        return fetchOne<Planet>('planets', id, 'residents')
    }
}