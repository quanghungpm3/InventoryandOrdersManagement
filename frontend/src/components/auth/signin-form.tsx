import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router";
import "../ui/login.css";

// ===== Zod Schema =====
const signInSchema = z.object({
  username: z
    .string()
    .min(3, "Tên đăng nhập phải có ít nhất 3 ký tự")
    .regex(/^[a-zA-Z0-9_-]+$/, "Bạn nhập sai cú pháp!"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type SignInFormValues = z.infer<typeof signInSchema>;

// ===== SigninForm Component =====
export function SigninForm({ className, ...props }: React.ComponentProps<"div">) {
  const { signIn } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormValues) => {
    await signIn(data.username, data.password);
    navigate("/");
  };

  return (
    <div className={`signin-container ${className}`} {...props}>
      <div className="card shadow-sm w-100 mx-auto" style={{ maxWidth: 900 }}>
        <div className="row g-0">
          <div className="col-12 col-md-6 d-flex flex-column justify-content-center p-4">
            <div className="text-center mb-4">
              <a href="/" className="d-block mb-2">
                <img src="/src/assets/logo.svg" alt="logo" className="img-fluid" style={{ height: 40 }} />
              </a>
              <h1 className="h4 fw-bold mb-1">Chào mừng bạn</h1>
              <p className="text-muted">Đăng nhập vào tài khoản của bạn</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="d-flex flex-column gap-3">

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
                {isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>

            <div className="mt-3 text-center small">
              Chưa có tài khoản? <a href="/signup" className="link-primary">Đăng ký</a>
            </div>
          </div>

          {/* Image Section */}
          <div className="col-md-6 d-none d-md-block position-relative">
            <img src="/src/assets/placeholder.png" alt="signin" className="img-fluid h-100 w-100 object-cover" />
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
