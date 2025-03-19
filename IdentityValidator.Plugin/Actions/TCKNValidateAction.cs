using IdentityValidator.Plugin.KPSPublic;
using Microsoft.Xrm.Sdk;
using System;
using System.ServiceModel;

namespace IdentityValidator.Plugin.Actions
{
    public class TCKNValidateAction : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            IPluginExecutionContext context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            try
            {
                if (!context.InputParameters.Contains("tckn") || !context.InputParameters.Contains("name") || !context.InputParameters.Contains("surname") || !context.InputParameters.Contains("birthYear"))
                {
                    throw new InvalidPluginExecutionException("Gerekli giriş parametreleri eksik. 'tckn', 'name', 'surname' ve 'birthYear' parametrelerinin sağlandığından emin olun.");
                }

                if (string.IsNullOrWhiteSpace(context.InputParameters["tckn"].ToString()) ||
                    string.IsNullOrWhiteSpace(context.InputParameters["name"].ToString()) ||
                    string.IsNullOrWhiteSpace(context.InputParameters["surname"].ToString()) ||
                    string.IsNullOrWhiteSpace(context.InputParameters["birthYear"].ToString()))
                {
                    throw new InvalidPluginExecutionException("Giriş parametreleri boş veya null olamaz.");
                }

                if (!long.TryParse(context.InputParameters["tckn"].ToString(), out long tcknLongValue))
                {
                    throw new InvalidPluginExecutionException("TCKN sayısal bir değer olmalıdır.");
                }

                if (tcknLongValue < 10000000000 || tcknLongValue > 99999999999)
                {
                    throw new InvalidPluginExecutionException("TCKN 11 haneli olmalıdır.");
                }

                string name = context.InputParameters["name"].ToString();
                string surname = context.InputParameters["surname"].ToString();
                if (!int.TryParse(context.InputParameters["birthYear"].ToString(), out int birthYear))
                {
                    throw new InvalidPluginExecutionException("Doğum yılı geçerli bir tam sayı olmalıdır.");
                }

                if (birthYear < 1900 || birthYear > DateTime.Now.Year)
                {
                    throw new InvalidPluginExecutionException("Doğum yılı geçerli bir yıl olmalıdır.");
                }

                BasicHttpBinding binding = new BasicHttpBinding(BasicHttpSecurityMode.Transport);
                EndpointAddress endpoint = new EndpointAddress("https://tckimlik.nvi.gov.tr/Service/KPSPublic.asmx");
                using (KPSPublicSoapClient client = new KPSPublicSoapClient(binding, endpoint))
                {
                    bool result = client.TCKimlikNoDogrula(tcknLongValue, name, surname, birthYear);
                    context.OutputParameters["isValid"] = result;
                    context.OutputParameters["errorMessage"] = string.Empty;
                }
            }
            catch (Exception ex)
            {
                context.OutputParameters["errorMessage"] = $"{ex.Message}";
                context.OutputParameters["isValid"] = false;
            }
        }
    }
}