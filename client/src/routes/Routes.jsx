import { SignUp } from '../pages/SignUp';
import { Routes, Route } from 'react-router-dom';
import { RegisterTask } from '../pages/RegisterTask';
import { ManagementTask } from '../pages/ManagemantTask';

export function Rotas() {
    return (
        <Routes>
            <Route>
                <Route index element={<SignUp/>}/>
                <Route path="/SignUp" element={<SignUp/>}/>
                <Route path="/registerTask" element={<RegisterTask/>}/>
                <Route path="/managementTask" element={<ManagementTask/>}/>
            </Route>
        </Routes>
    )
}