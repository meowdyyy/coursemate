
// activate user
interface ActivationRequest {
    activation token: string;
    activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const { activation_token, activation_code } =
          req-body as IActivationRequest;
         
        const newUser: { user: IUser; activationCode: string } = jwt.verify(
          activation_token,
          process.env.ACTIVATION_SECRET as string
        ) as {user: IUser; activationCode: string};

        if (newUser.activationCode !== activation_code) {
            return next (new ErrorHandler ("Invalid activation code", 400));
        }

        const { name, email, password } = newUser.user;

        const existUser = await userModel.findOne({ email });
        if (existUser) {

            return next (new ErrorHandler("Email already exist", 400));
        }

        const user = await userModel. create({
                name,
                email,
                password,
        });

        res.status(201).json({
            success: true,
        });
    } catch (error:any) {
        return next (new ErrorHandler(error.message, 400));
    }
  }
);


//Login user

interface ILoginRequest {
    email: string;
    password: string;
}

export const loginuser = CatchAsyncError(async(req:Request,res:Response, next:NextFunction) => {
    try{
 
        const {email,password} = req.body as ILoginRequest;
        
        if (!email || !password){
            return next (new ErrorHandler ("Please enter email and password",400));
        };

        const user = await userModel. findOne({email}).select ("+password");
        if (!user){
            return next(new ErrorHandler ("Invalid email or password", 400));
        };

        const isPasswordMatch = await user.comparePassword(password);
        if(!isPasswordMatch){
            return next (new ErrorHandler ("Invalid email or password", 400));
        };

         sendToken(user,200,res);

    }
    
     catch (error:any) {
        return next(new ErrorHandler(error.message,400));
    }
});


//logout user

export const logoutuser = CatchAsyncError(async(req:Request,res:Response, next:NextFunction) => {


        try {
            res.cookie("access_token", "", {maxAge: 1 });
            res.cookie("refresh_token", "", {maxAge: 1 });
            res.status(200).json({
                success:true,
                message: "Logged out successfully",

            });

        } catch error (error:any){

            return next(new ErrorHandler(error.message, 400));
        }
 }
);