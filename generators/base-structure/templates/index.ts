/* istanbul ignore file */
import './initialization';
<%- servers %>
import { application } from './application';

application.start();
