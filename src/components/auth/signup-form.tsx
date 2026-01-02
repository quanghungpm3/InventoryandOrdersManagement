import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import "../ui/login.css";


// Zod schema
const signUpSchema = z.object({
  firstname: z.string().min(1, "Tên của bạn"),
  lastname: z.string().min(1, "Họ của bạn"),
  username: z.string().min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
  .regex(/^[a-zA-Z0-9_-]+$/, "Bạn nhập sai cú pháp!"),
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signUp } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpFormValues) => {
    await signUp(
      data.username,
      data.password,
      data.email,
      data.firstname,
      data.lastname
    );
    navigate("/signin");
  };

  return (
    <div className={`signin-container ${className}`} {...props}>
      <div className="card shadow-sm w-100 mx-auto" style={{ maxWidth: 900 }}>
        <div className="row g-0">

          {/* Form */}
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center p-4">
            <div className="text-center mb-4">
              <a href="/" className="d-block mb-2">
                <img src="/src/assets/logo.svg" alt="logo" className="img-fluid" style={{ height: 40 }} />
              </a>
              <h1 className="h4 fw-bold mb-1">Tạo tài khoản</h1>
              <p className="text-muted">Chào mừng bạn! Hãy đăng ký để bắt đầu!</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">

              <div className="row g-3">
                <div className="col">
                  <label htmlFor="lastname" className="form-label">Họ</label>
                  <input
                    id="lastname"
                    className={`form-control ${errors.lastname ? 'is-invalid' : ''}`}
                    placeholder={errors.lastname?.message || "Nhập họ của bạn"}
                    {...register("lastname")}
                  />
                </div>
                <div className="col">
                  <label htmlFor="firstname" className="form-label">Tên</label>
                  <input
                    id="firstname"
                    className={`form-control ${errors.firstname ? 'is-invalid' : ''}`}
                    placeholder={errors.firstname?.message || "Nhập tên của bạn"}
                    {...register("firstname")}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                <input
                  id="username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  placeholder={errors.username?.message || "Nhập tên đăng nhập của bạn"}
                  {...register("username")}
                />
              </div>

              <div>
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  id="email"
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder={errors.email?.message || "Nhập Email của bạn: ...@gmail.com"}
                  {...register("email")}
                />
              </div>

              <div>
                <label htmlFor="password" className="form-label">Mật khẩu</label>
                <input
                  id="password"
                  type="password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  placeholder={errors.password?.message || "Nhập mật khẩu của bạn"}
                  {...register("password")}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={isSubmitting}>
                Tạo tài khoản
              </button>
            </form>

            <div className="mt-3 text-center small">
              Đã có tài khoản? <a href="/signin" className="link-primary">Đăng nhập</a>
            </div>
          </div>

          {/* Image */}
            <div className="col-md-6 d-none d-md-block position-relative">
              <img src="/src/assets/placeholderSignUp.png" alt="signin" className="img-fluid h-100 w-100 object-cover" />
            </div>

        </div>
      </div>

      {/* Terms */}
      <p className="text-center small text-muted mt-3">
        Bằng cách tiếp tục, bạn đồng ý với <a href="#" className="link-primary">Điều khoản dịch vụ</a> và <a href="#" className="link-primary">Chính sách bảo mật</a>.
      </p>
    </div>
  );
}
