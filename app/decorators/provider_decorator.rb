# frozen_string_literal: true

class ProviderDecorator < ApplicationDecorator
  include System::UrlHelpers.system_url_helpers

  self.include_root_in_json = false

  def new_application_form_data(buyer: nil, service: nil, cinstance: nil)
    data = {
      'create-application-plan-path': new_admin_service_application_plan_path(':id'),
      'create-service-plan-path': new_admin_service_service_plan_path(':id'),
      'service-subscriptions-path': admin_buyers_account_service_contracts_path(':id'),
      'service-plans-allowed': settings.service_plans.allowed?.to_json,
      'defined-fields': application_defined_fields_data.to_json
    }
    data[:errors] = cinstance.errors.to_json if cinstance

    if service
      data.merge(product_context_new_application_form_data(service))
    elsif buyer
      data.merge(buyer_context_new_application_form_data(buyer))
    else
      data.merge(audience_context_new_application_form_data)
    end
  end

  def audience_context_new_application_form_data
    {
      'create-application-path': admin_buyers_applications_path,
      buyers: application_buyers_initial_data.to_json,
      'buyers-count': buyer_accounts.not_master.size,
      products: application_products_initial_data.to_json,
    }
  end

  def buyer_context_new_application_form_data(buyer)
    {
      'create-application-path': admin_buyers_account_applications_path(buyer),
      buyer: BuyerDecorator.new(buyer).new_application_data.to_json,
      products: application_products_initial_data.to_json,
    }
  end

  def product_context_new_application_form_data(product)
    {
      'create-application-path': admin_buyers_applications_path,
      product: ServiceDecorator.new(product).new_application_data.to_json,
      buyers: application_buyers_initial_data.to_json,
      'buyers-count': buyer_accounts.not_master.size,
    }
  end

  def application_products_initial_data
    accessible_services.order(updated_at: :desc)
                       .limit(20)
                       .map do |service|
                         ServiceDecorator.new(service).new_application_data
                       end
  end

  def application_buyers_initial_data
    buyer_accounts.not_master
                  .order(created_at: :desc)
                  .limit(20)
                  .map do |buyer|
                    BuyerDecorator.new(buyer).new_application_data
                  end
  end

  def application_defined_fields_data
    fields_definitions.where(target: 'Cinstance')
                      .map do |field|
                        FieldsDefinitionDecorator.new(field).new_application_data(self)
                      end
  end
end
