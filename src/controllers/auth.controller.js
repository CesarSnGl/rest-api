import jwt from 'jsonwebtoken'; 
import User from '../models/User';
import Role from '../models/Role';

export const signUp = async (req, res) => {
    const { username, email, password, roles } = req.body;

    try {
        const newUser = new User({
            username,
            email,
            password: await User.encryptPassword(password),
            roles
        });

        if (req.body.roles) {
            const foundRoles = await Role.find({name: {$in: roles}});
            newUser.roles = foundRoles.map(role => role._id);
        } else {
            const role = await Role.findOne({ name: "user"});
            newUser.roles = [role._id];
        }
        //Guardar el usuario en la base de datos
        const savedUser = await newUser.save();
        console.log(savedUser);

        // Crear el token JWT después de guardar el nuevo usuario
        const token = jwt.sign({ userId: savedUser._id }, process.env.SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

export const signIn = async (req, res) => {
    const userFound =await User.findOne({email: req.body.email}).populate("roles");

    if(!userFound) return res.status(400).json({message:"Usuario no encontrado"});
    
    //Verificar la contraseña
    const matchPassword =await User.comparePassword(req.body.password,userFound.password);

    //Si la contraseña no coincide, enviar un error
    if(!matchPassword) return res.status(401).json({token:null,message:"Contraseña invalida"});

    //Generar token
    const token =jwt.sign({id: userFound._id},process.env.SECRET,{
        expiresIn :86400 //24 horas
    });


    res.status(200).json({token});
    
};