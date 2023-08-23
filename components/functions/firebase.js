import firestore from '@react-native-firebase/firestore';
import { storage } from "../common";
import { getLogin } from "./storageMMKV";


export function uploadFavouriteFirebase(newFav, type) {
    // const dispatch = useDispatch()
    const profile = getLogin()

    firestore().collection('users').doc(profile.uid).update(
        type == 'res' ?
            { favoriteRes: newFav } :
            { favoriteItem: newFav }
    ).then(() => {
    }).catch((err) => {
        console.log('err uploadFavouriteFirebase', err)
    })

}

