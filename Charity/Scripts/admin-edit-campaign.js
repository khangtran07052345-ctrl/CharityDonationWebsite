
document.addEventListener("DOMContentLoaded", function () {

    // Lấy các phần tử trên trang
    var form = document.getElementById("editCampaignForm");
    var imageInput = document.getElementById("campaignImage");
    var preview = document.getElementById("imagePreview");

    var startInput = document.getElementById("StartDate");
    var endInput = document.getElementById("EndDate");
    var targetInput = document.getElementById("TargetAmount");

    // XEM TRƯỚC ẢNH ĐƯỢC CHỌN
    if (imageInput && preview) {

        imageInput.addEventListener("change", function () {

            var file = imageInput.files[0];

            if (!file) {
                return;
            }

            var allowedTypes = [
                "image/jpeg",
                "image/png",
                "image/gif",
                "image/webp"
            ];

            if (allowedTypes.indexOf(file.type) === -1) {
                alert("Vui lòng chọn ảnh JPG, PNG, GIF hoặc WEBP.");
                imageInput.value = "";
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Ảnh không được vượt quá 5 MB.");
                imageInput.value = "";
                return;
            }

            preview.src = URL.createObjectURL(file);
            preview.style.display = "block";
        });
    }

    // KIỂM TRA DỮ LIỆU TRƯỚC KHI LƯU
    if (
        form !== null &&
        startInput !== null &&
        endInput !== null &&
        targetInput !== null
    ) {

        form.addEventListener("submit", function (event) {

            var startDate = startInput.value;
            var endDate = endInput.value;
            var targetAmount = Number(targetInput.value);

            if (
                targetInput.value.trim() === "" ||
                !isFinite(targetAmount) ||
                targetAmount <= 0
            ) {
                event.preventDefault();
                alert("Mục tiêu quyên góp phải lớn hơn 0.");
                targetInput.focus();
                return;
            }

            if (startDate === "" || endDate === "") {
                event.preventDefault();
                alert("Vui lòng nhập đầy đủ ngày bắt đầu và ngày kết thúc.");
                return;
            }

            if (endDate <= startDate) {
                event.preventDefault();
                alert("Ngày kết thúc phải sau ngày bắt đầu.");
                endInput.focus();
                return;
            }
        });
    }
});
