<script lang="ts">
    import { env } from "$env/dynamic/public";
    const { PUBLIC_APP_NAME, PUBLIC_SITE_URL } = env;
    const siteUrl =
        PUBLIC_SITE_URL?.replace("https://", "")?.replace("http://", "") ||
        "birsley.in";
</script>

<div class="py-20 max-w-4xl mx-auto px-6">
    <h1 class="text-4xl font-heading font-extrabold mb-8 text-gray-900">
        Privacy Policy
    </h1>
    <div class="prose prose-lg text-gray-600 space-y-6">
        <p>
            Your privacy is important to us. It is {PUBLIC_APP_NAME}'s policy to
            respect your privacy regarding any information we may collect from
            you across our website, {siteUrl}, and other sites we own and
            operate.
        </p>
        <p>
            We only ask for personal information when we truly need it to
            provide a service to you. We collect it by fair and lawful means,
            with your knowledge and consent.
        </p>
        <p>
            We only retain collected information for as long as necessary to
            provide you with your requested service.
        </p>
    </div>
</div>
