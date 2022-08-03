import bookshop from './Bookshop.svelte'
import bookshopBrowser from './BookshopBrowser.svelte'
import { make_bookshop_proxy } from "./proxy.js";

export const Bookshop = bookshop;
export const BookshopBrowser = bookshopBrowser;
export const trackBookshopLiveData = (params) => {
    return make_bookshop_proxy(params);
}