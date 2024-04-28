import { View, Text } from 'react-native'
import React from 'react'
import {images} from '../constants'

export const ExperimentData = [
    {
        id: 1,
        title: "Husky",
        description: "Husky is a general name for a sled-type of dog used in northern regions, differentiated from other sled-dog types by their fast pulling style.",
        uploadedImage: images.husky,
        avatar: images.avatar,
        username: "HuskyLover",
        likes: 100,
        dislikes: 34,
        comments: 96

    },
    {
        id: 2,
        title: "Golden Retriever",
        description: "The Golden Retriever is a medium-large gun dog that retrieves shot waterfowl, such as ducks and upland game birds, during hunting and shooting parties.",
        uploadedImage: images.goldenretriever,
        avatar: images.avatar1,
        username: "John Doe",
        likes: 82,
        dislikes: 17,
        comments: 69
    },
    {
        id: 3,
        title: "Pomeranian",
        description: "The Pomeranian is a breed of dog of the Spitz type that is named for the Pomerania region in north-west Poland and north-east Germany in Central Europe.",
        uploadedImage: images.pomeranian,
        avatar: images.avatar2,
        username: "Jane Doe",
        likes: 425,
        dislikes: 81,
        comments: 101
    },
    {
        id: 4,
        title: "Pomeranian",
        description: "The Pomeranian is a breed of dog of the Spitz type that is named for the Pomerania region in north-west Poland and north-east Germany in Central Europe.",
        uploadedImage: images.pomeranian,
        avatar: images.avatar2,
        username: "Jane Doe",
        likes: 425,
        dislikes: 81,
        comments: 101
    }
]

export const ItemDummy = [
    {
        id: 1,
        title:"Dog Food",
        price: 200000,
        image: images.dogfood,
        rating: 4.8
    },
    {
        id: 2,
        title:"Dog bowl",
        price: 50000,
        image: images.dogbowl,
        rating: 4.5
    }
    ,
    {
        id: 3,
        title:"Dog Leash",
        price: 70000,
        image: images.dogleash,
        rating: 4.0
    },
    {
        id: 4,
        title:"Dog Toy",
        price: 30000,
        image: images.dogtoy,
        rating: 5.0
    },
    {
        id: 5,
        title:"Dog Toy",
        price: 30000,
        image: images.dogtoy,
        rating: 5.0
    },
    {
        id: 6,
        title:"Dog Toy",
        price: 30000,
        image: images.dogtoy,
        rating: 5.0
    },
    {
        id: 7,
        title:"Dog Toy",
        price: 30000,
        image: images.dogtoy,
        rating: 5.0
    },
    {
        id: 8,
        title:"Dog Toy",
        price: 30000,
        image: images.dogtoy,
        rating: 5.0
    }

]

export const PetDummy = [
    {
        id: 1,
        name: "Chicko",
        image: images.adopt1,
        gender: "Male",
        age: "3 years old"
    },
    {
        id: 2,
        name: "Luna",
        image: images.adopt2,
        gender: "Female",
        age: "2 years old"
    },
    {
        id: 3,
        name: "Borak",
        image: images.adopt3,
        gender: "Male",
        age: "4 years old"
    },
    {
        id: 4,
        name: "Bella",
        image: images.adopt4,
        gender: "Female",
        age: "1 year old"},
    {
        id: 5,
        name: "Toby",
        image: images.adopt5,
        gender: "Male",
        age: "6 years old"
    },
    {
        id: 6,
        name: "Jojo",
        image: images.adopt6,
        gender:"Male",
        age: "8 years old"
    }
]
