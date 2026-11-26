
using Charity.Models;
using System.Linq;
using System.Web.Mvc;

namespace Charity.Controllers
{
    public class CampaignImageController : Controller
    {
        private readonly CharityDBEntities db =
            new CharityDBEntities();

        [HttpGet]
        public ActionResult Show(int id)
        {
            var campaign = db.Campaigns
                .FirstOrDefault(c => c.Id == id);

            if (campaign == null)
            {
                return HttpNotFound();
            }

            // Ưu tiên lấy ảnh từ SQL Server
            if (campaign.ImageData != null &&
                campaign.ImageData.Length > 0)
            {
                string contentType = campaign.ImageContentType;

                if (contentType != "image/jpeg" &&
                    contentType != "image/png" &&
                    contentType != "image/gif" &&
                    contentType != "image/webp")
                {
                    contentType = "application/octet-stream";
                }

                return File(campaign.ImageData, contentType);
            }

            // Nếu chưa có ảnh trong SQL thì dùng ảnh cũ
            if (!string.IsNullOrWhiteSpace(campaign.ImageUrl) &&
                campaign.ImageUrl.StartsWith("/Content/"))
            {
                return Redirect(Url.Content(campaign.ImageUrl));
            }

            return HttpNotFound();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }

            base.Dispose(disposing);
        }
    }
}
