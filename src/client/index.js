import { processRequest } from './js/app'

import './styles/resets.scss'
import './styles/base.scss'
import './styles/form.scss'
import './styles/footer.scss'
import './styles/header.scss'
import './styles/details.scss'


document.querySelector('#submit').addEventListener('click', processRequest);

export {
    processRequest
}