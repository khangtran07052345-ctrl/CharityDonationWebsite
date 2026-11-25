
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;
using Charity.Models;
using Charity.Services;

namespace Charity.Controllers
{
    public class AccountController : Controller
    {
        private CharityDBEntities database = new CharityDBEntities();

        // GET: Account
        public ActionResult Index()
        {
            return View();
        }

        // GET: Account/Login
        [HttpGet]
        public ActionResult Login()
        {
            return View();
        }

        // POST: Account/Login
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Login(string Email, string Password)
        {
            if (string.IsNullOrWhiteSpace(Email) ||
                string.IsNullOrWhiteSpace(Password))
            {
                ViewBag.Error = "Vui lòng nhập email và mật khẩu.";
                ViewBag.Email = Email;
                return View();
            }

            Email = Email.Trim();

            var user = database.Users.FirstOrDefault(
                u => u.Email == Email
            );

            if (user == null ||
                !PasswordHelper.Verify(Password, user.PasswordHash))
            {
                ViewBag.Error = "Email hoặc mật khẩu không đúng.";
                ViewBag.Email = Email;
                return View();
            }

            // Tài khoản cũ còn mật khẩu rõ: băm lại mật khẩu
            if (!PasswordHelper.IsHashed(user.PasswordHash))
            {
                user.PasswordHash = PasswordHelper.Hash(Password);
                database.SaveChanges();
            }

            // Đăng nhập Forms Authentication
            FormsAuthentication.SetAuthCookie(user.Email, false);

            // Lưu thông tin người dùng vào Session
            Session["UserId"] = user.Id;
            Session["FullName"] = user.FullName;
            Session["Role"] = user.Role;

            // Điều hướng theo quyền
            if (user.Role == "Admin")
            {
                return RedirectToAction("Index", "Admin");
            }

            return RedirectToAction("Index", "Home");
        }

        // GET: Account/Register
        [HttpGet]
        public ActionResult Register()
        {
            return View();
        }

        // POST: Account/Register
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Register(
            string FullName,
            string Email,
            string Password,
            string ConfirmPassword,
            string PhoneNumber)
        {
            // Kiểm tra họ tên
            if (string.IsNullOrWhiteSpace(FullName))
            {
                ViewBag.Error = "Vui lòng nhập họ và tên.";
                return View();
            }

            // Kiểm tra email
            if (string.IsNullOrWhiteSpace(Email))
            {
                ViewBag.EmailError = "Vui lòng nhập địa chỉ email.";
                return View();
            }

            // Chuẩn hóa email
            FullName = FullName.Trim();
            Email = Email.Trim();

            // Kiểm tra định dạng email
            try
            {
                var emailAddress = new System.Net.Mail.MailAddress(Email);

                if (emailAddress.Address != Email)
                {
                    ViewBag.EmailError = "Địa chỉ email không hợp lệ.";
                    return View();
                }
            }
            catch
            {
                ViewBag.EmailError = "Địa chỉ email không hợp lệ.";
                return View();
            }

            // Kiểm tra mật khẩu
            if (string.IsNullOrWhiteSpace(Password))
            {
                ViewBag.Error = "Vui lòng nhập mật khẩu.";
                return View();
            }

            if (Password.Length < 8)
            {
                ViewBag.Error = "Mật khẩu phải từ 8 ký tự trở lên.";
                return View();
            }

            // Kiểm tra xác nhận mật khẩu
            if (string.IsNullOrWhiteSpace(ConfirmPassword))
            {
                ViewBag.Error = "Vui lòng xác nhận mật khẩu.";
                return View();
            }

            if (Password != ConfirmPassword)
            {
                ViewBag.Error = "Mật khẩu xác nhận không khớp.";
                return View();
            }

            // Kiểm tra email đã tồn tại
            bool emailExists = database.Users.Any(
                u => u.Email.ToLower() == Email.ToLower()
            );

            if (emailExists)
            {
                ViewBag.EmailError =
                    "Email này đã được sử dụng. Vui lòng chọn email khác!";

                return View();
            }

            // Tạo tài khoản mới
            var user = new User
            {
                FullName = FullName,
                Email = Email,
                PasswordHash = PasswordHelper.Hash(Password),
                PhoneNumber = string.IsNullOrWhiteSpace(PhoneNumber)
                    ? null
                    : PhoneNumber.Trim(),
                Role = "User",
                CreatedAt = DateTime.Now
            };

            try
            {
                database.Users.Add(user);
                database.SaveChanges();

                TempData["Success"] =
                    "Đăng ký thành công. Bạn hãy đăng nhập.";

                return RedirectToAction("Login");
            }
            catch (Exception)
            {
                ViewBag.Error =
                    "Đăng ký thất bại. Vui lòng thử lại sau.";

                return View();
            }
        }

        // GET: Account/Logout
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();

            Session.Clear();
            Session.Abandon();

            return RedirectToAction("Index", "Home");
        }

        // Giải phóng kết nối database
        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                database.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
